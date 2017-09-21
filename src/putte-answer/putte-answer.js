'use strict'
const R = require('ramda')
const M = require('ramda-fantasy').Maybe
const most = require('most')
const { normalizeMessage } = require('../irc2stream/normalize-message')
const { maybePutteResponse } = require('./putte-talk')

/**
 * Send message to IRC
 *
 * @sig messageToIrc :: Responder -> String -> String -> void
 *  Responder = (String, String), a funktion that can send messages to IRC
 */
const messageToIrc = R.curry((responder, to, message) => {
  responder(to, message)
})

/**
 * Create a putte answer stream from a normalized message.
 *
 * TODO: add nick argument and replace 'bot'
 *
 * @sig createPutteAnswerStream :: Responder -> NormalizedMessage -> Stream
 *  Responder = (String -> String)
 */
const createPutteAnswerStream = R.curry((nick, responder, normalizedMessage) =>
  most
    .of(maybePutteResponse(normalizedMessage))
    .filter(M.isJust)
    .map(mres => mres.getOrElse('Bot answer stream error.'))
    .tap(messageToIrc(responder, normalizedMessage.to))
    .map(normalizeMessage(nick, normalizedMessage.to))
)

module.exports = { messageToIrc, createPutteAnswerStream }
