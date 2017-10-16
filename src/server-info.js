/** Get object with server info */
const ip = require("ip");

module.exports = {
    ip: ip.address(),
    port: process.env.PUTTEPORT || 1337
};
