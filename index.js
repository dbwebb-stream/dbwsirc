/** Irc bot, express server, socket.io.*/
'use strict'

// Includes
const R = require('ramda')
const M = require('ramda-fantasy').Maybe
const app = require('express')()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const irc = require('irc')
const most = require('most')

const log = require('./src/logger/logger')
const db = require('./src/database-log/database-log')
const {
  // putteResponse,
  maybePutteResponse,
  messageToIrc
} = require('./src/putte-talk/putte-talk')
const { normalizeMessage } = require('./src/irc2stream/normalize-message')
const {
  messageToConsole,
  isChannelMessage
} = require('./src/irc2stream/irc2stream')

/**
 * Bot settings
 *
 * @sig botSettings :: Object
 */
const botSettings = {
  server: 'irc.bsnet.se',
  nickname: 'putte',
  options: {
    debug: false,
    channels: ['#db-o-webb-student'],
    port: 6667,
    realName: 'a little bot listener',
    retryDelay: 7000,
    stripColors: true
  }
}

/////////////////////////////////////////////////////////////////////
// Create the IRC bot and message handler
//

// const putte = irc2stream.createIRCBot(botSettings)
const putte = new irc.Client(
  botSettings.server,
  botSettings.nickname,
  botSettings.options
)

/**
 * Create sqlite database object
 */
const dblog = db.createDbLogger('./db/log.sqlite')

/**
 * Save to database log
 *
 * @sig saveDbLog :: NormalizedMessage -> void
 */
const dbLogMessage = db.logMessage(dblog)

/////////////////////////////////////////////////////////////////////
// Setup bot listeners
//

/**
 * @sig putteAnswerStream :: NormalizedMessage -> Stream
 */
const putteAnswerStream = R.compose(most.of, maybePutteResponse)

/**
 * Use most.js to handle irc message stream.
 *
 * TODO: Cleanup
 */
most
  .fromEvent('message', putte)
  .map(([from, to, message]) => normalizeMessage(from, to, message))
  .tap(messageToConsole)
  .filter(isChannelMessage)
  .chain(nm =>
    most.merge(
      most.of(nm),
      putteAnswerStream(nm)
        .filter(M.isJust)
        .map(mres => mres.getOrElse('Bot answer stream error.'))
        .tap(messageToIrc(putte.say.bind(putte), nm.to))
        .map(normalizeMessage(nm.to, nm.from))
      // .tap(log.c('PutteAnswerStream: '))
    )
  )
  // .tap(log.c('\nAfter chaining putte answer: '))
  .tap(dbLogMessage)
  .forEach(nm => io.emit('message', nm))

putte.addListener('registered', log.c('Registered: '))

putte.addListener('error', log.e('Bot error: '))

/////////////////////////////////////////////////////////////////////
// Express server and socket stuff
//

// Serve index.html
app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/htdocs/info.html`)
})

// Send bot settings
app.get('/botsettings', (req, res) => {
  res.json(botSettings)
})

// Retrieve history from now
app.get('/history/:max(\\d+)', (req, res) => {
  const maxMessages = req.params.max
  const sql = 'SELECT * FROM log ORDER BY `time` desc LIMIT ?'
  db
    .query(dblog, sql, [maxMessages])
    .then(rows => {
      res.json(rows)
    })
    .catch(err => {
      log.e('History error from sql: ')(err)
      res.status(500).json({ error: err })
    })
})

// Socket
io.on('connection', socket => {
  log.c('incoming connection')('')

  socket.on('disconnect', () => {
    log.c('connection closed')('')
  })
})

// Start listening
http.listen(1337, () => {
  log.c('listening on *:1337')('')
})
