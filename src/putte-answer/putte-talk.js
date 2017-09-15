/** Make the bot talk */
'use strict'

// Includes
const R = require('ramda')
const M = require('ramda-fantasy').Maybe

/******************************
 * String matches to listen for
 */

/**
 * Test if input has "hej" followed by "putte"
 *
 * @sig { message: String } -> Boolean
 */
// TODO: skulle detta att göra att putte pratar med sig själv???? 
const isHelloPutte = ({ message }) => R.test(/hej.+putte/i, message)
// const isHelloPutte = ({ message }) => R.test(/hej\s+putte/i, message)

/**
 * Test if input contains "putte" followed by "hjälp"
 *
 * @sig { message: String } -> Boolean
 */
const isHelpPutte = ({ message }) => R.test(/putte.+hjälp/i, message)
// const isHelpPutte = ({ message }) => R.test(/putte\s+hjälp/i, message)

/**
 * Bot answers to input message.
 *
 * @sig NormalizedMessage -> String|undefined
 */
const putteResponseMapper = R.cond([
  [isHelloPutte, R.always('Hej, jag heter putte och är en bot')],
  [isHelpPutte, R.always('Äh, jag kan ingenting. Be marvin.')]
])

/**
 * Get a Maybe response to input message.
 *
 * @sig maybePutteResponse :: NormalizedMessage -> Just(String)|Nothing()
 */
const maybePutteResponse = R.compose(M.toMaybe, putteResponseMapper)

module.exports = {
  putteResponseMapper,
  maybePutteResponse
}
