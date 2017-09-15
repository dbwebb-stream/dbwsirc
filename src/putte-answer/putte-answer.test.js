/** Test putteTalk module */
/* global test, expect */
const { messageToIrc, createPutteAnswerStream } = require('./putte-answer')
const { _normalizeMessage } = require('../irc2stream/normalize-message')

/**
 * TODO: New test suit. Error in thinking
 */

let theFakeChannel = null

const putteTestResponder = messageToIrc((to, message) => {
  theFakeChannel = { to, message }
  console.log('after')
})

const answerMessage = {
  to: '#channel',
  from: 'whoever',
  message: 'hej putte'
}

const noAnswerMessage = {
  to: '#channel',
  from: 'whoever',
  message: 'nope no answer'
}

// test('stream should answer on fakeChannel', done => {
//   theFakeChannel = null
//   const pas = createPutteAnswerStream(putteTestResponder, answerMessage)
//   pas.observe(() => {}).then(() => done())
//   expect(theFakeChannel).toEqual({
//     to: '#channel',
//     message: 'Hej, jag heter putte och är en bot'
//   })
// })

test('stream should not answer on fakeChannel', () => {
  theFakeChannel = null
  createPutteAnswerStream(putteTestResponder, noAnswerMessage)
  expect(theFakeChannel).toEqual(null)
})

// test('stream should end with normalized message', done => {
//   theFakeChannel = null
//   const pas = createPutteAnswerStream(putteTestResponder, answerMessage)
//   expect(
//     pas
//       .observe(nm =>
//         expect(nm).toEqual(
//           _normalizeMessage(
//             1,
//             answerMessage.from,
//             answerMessage.to,
//             answerMessage.message
//           )
//         )
//       )
//       .then(() => done())
//   ).toEqual(null)
// })
