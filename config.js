/** App & bot config */
const server = require('./src/server-info')

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

/**
 * App settings
 *
 * @sig appSettings :: Object
 */
const appSettings = {
  ip: server.ip,
  port: server.port,
  dblog: './db/log.sqlite',
  processTitle: 'puttebot'
}

module.exports = { botSettings, appSettings }
