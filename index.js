/** Irc bot, express server, socket.io.*/
'use strict'

// Includes
const R = require('ramda')
const app = require('express')()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const irc = require('irc')

const log = require('./src/logger/logger')
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
    debug: true,
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
 * Save to database log
 *
 * @sig saveDbLog :: NormalizedMessage -> void
 */
const dbLogger = R.identity

/////////////////////////////////////////////////////////////////////
// Setup bot listeners
//

/**
 * First draft possible IO monad use
 *
 * @sig handleMessage :: NormalizedMessage -> IO()
 */
// const handleMessage = normalizedMessage => IO(
//   () => {
//     messageToConsole(normalizedMessage)
//     if (isChannelMessage) {
//       io.emit('message', normalizedMessage)
//       dbLogger(normalizedMessage)
//       putteResponder(normalizedMessage).runIO()
//     }
//   }
// )

putte.addListener('registered', log.c('Registered: '))

putte.addListener('error', log.e('Bot error: '))

const onChannelMessage = R.pipe(
  R.tap(nm => io.emit('message', nm)),
  R.tap(dbLogger),
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
  res.sendFile(`${__dirname}/index.html`)
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
