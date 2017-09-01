/* Irc bot, express server, socket.io.*/

// Includes
const app = require('express')()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const log = require('logger/logger')

const irc = require('irc')

//
// IRC bot
//
const putte = new irc.Client('irc.bsnet.se', 'putte', {
  debug: true,
  channels: ['#db-o-webb-student'],
  port: 6667,
  realName: 'little bot listner',
  retryDelay: 7000,
})

putte.addListener('error', (message) => {
  log.c(`Bot error: ${message.command}: ${message.args.join(' ')}`)('')
})

putte.addListener('message', (from, to, message) => {
  log.c(`From: ${from}\nTo: ${to}\n${message}`)('')
  if (to.match(/^[#&]/)) {
    // channel message
    if (message.match(/hej\s+putte/i)) {
      putte.say(to, 'Hej, jag heter putte och är en bot')
    } else if (message.match(/putte\s+hjälp/i)) {
      putte.say(to, 'Äh, jag kan ingenting. Be någon annan.')
    }
    // Send message on websocket
    io.emit('message', {
      from,
      to,
      message,
    })
  } else {
    // private message ??
    log.c('No match on channel. Private message??')('')
  }
})

// Server and socket stuff


// Serve index.html
app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/index.html`)
})

// Socket
io.on('connection', (socket) => {
  log.c('incoming connection')

  socket.on('disconnect', () => {
    log.c('connection closed')('')
  })
})

// Start listening
http.listen(1337, () => {
  log.c('listening on *:1337')('')
})
