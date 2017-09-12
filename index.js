/** Irc bot, express server, socket.io.*/
'use strict'

// Includes
const R = require('ramda')
const M = require('ramda-fantasy')
const app = require('express')()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const irc = require('irc')
const most = require('most')

const log = require('./src/logger/logger')
const db = require('./src/database-log/database-log')
const { putteResponse } = require('./src/putte-talk/putte-talk')
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

const maybeStream = M.maybe(most.empty, most.just)

const putteAnswerStream = maybeStream()

putte.addListener('registered', log.c('Registered: '))

putte.addListener('error', log.e('Bot error: '))

const onChannelMessage = R.pipe(
  R.tap(nm => io.emit('message', nm)),
  R.tap(dbLogMessage),
  R.tap(putteResponse(putte.say.bind(putte)))
)

const onMessage = R.pipe(
  normalizeMessage,
  R.tap(messageToConsole),
  R.when(isChannelMessage, onChannelMessage)
)

putte.addListener('message', onMessage)

/////////////////////////////////////////////////////////////////////
// Express server and socket stuff
//

// Serve index.html
app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/info.html`)
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
