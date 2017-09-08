/** Make the bot talk */
'use strict'

// Includes
const R = require('ramda')

/******************************
 * String matches to listen for
 */

/**
 * Test if input has "hej" followed by "putte"
 *
 * @sig { message: String } -> Boolean
 */
// TODO: skulle detta att göra att putte pratar med sig själv????
// const isHelloPutte = ({message}) => R.test(/hej.+putte/i, message)
const isHelloPutte = ({ message }) => R.test(/hej\s+putte/i, message)

/**
 * Test if input contains "putte" followed by "hjälp"
 *
 * @sig { message: String } -> Boolean
 */
// const isHelpPutte = ({message}) => R.test(/putte.+hjälp/i, message)
const isHelpPutte = ({ message }) => R.test(/putte\s+hjälp/i, message)

/**
 * Bot answers to input strings.
 *
 * @sig { message: String } -> String|undefined
 */
const putteResponseMapper = R.cond([
  [isHelloPutte, R.always('Hej, jag heter putte och är en bot')],
  [isHelpPutte, R.always('Äh, jag kan ingenting. Be marvin.')]
])

/**
 * The actual response emitter
 *
 * @sig ((String, String) -> NormalizedMessage -> void
 */
const putteResponse = botResponder => normalizedMessage => {
  const response = putteResponseMapper(normalizedMessage)
  if (response) {
    botResponder(normalizedMessage.to, response)
  }
}

module.exports = { putteResponseMapper, putteResponse }
