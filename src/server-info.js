/** Get object with server info */
const ip = require('ip')

module.exports = {
  ip: ip.address(),
  port: 1337
}
