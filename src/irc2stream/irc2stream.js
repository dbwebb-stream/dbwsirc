/** Helpers */
'use strict'
const R = require('ramda')
const log = require('../logger/logger')

/**
 * Check if input starts with "#" or "&" which indicates a channel message
 *
 * @sig isChannelMessage :: {to: string} -> Boolean
 */
const isChannelMessage = ({ to }) => R.test(/^[#&]/, to)

/**
 * Log incoming message to console
 *
 * @sig messageToConsole :: { String, String, String} -> void
 */
const messageToConsole = ({ from, to, message }) => {
  log.c(`${from} => ${to}\n${message}`)('')
}

module.exports = {
  isChannelMessage,
  messageToConsole
}
