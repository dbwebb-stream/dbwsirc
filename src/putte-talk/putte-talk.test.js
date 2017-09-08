/** Test putteTalk module */
/* global test, expect */
const { putteResponseMapper, putteResponse } = require('./putte-talk')

let theFakeChannel = null

const putteTestResponder = putteResponse((to, message) => {
  theFakeChannel = { to, message }
})

test('should answer to "hej putte" with Just(<mess>)', () => {
  expect(putteResponseMapper({ message: 'hej putte!' })).toEqual(
    'Hej, jag heter putte och är en bot'
  )
})

test('should answer to "putte hjälp" with Just(<mess>)', () => {
  expect(putteResponseMapper({ message: 'putte hjälp' })).toEqual(
    'Äh, jag kan ingenting. Be marvin.'
  )
})

test('should be Nothing when no matching string', () => {
  expect(putteResponseMapper({ message: 'randomstring' })).toBeUndefined()
})

test('responder should respond to "hej putte"', () => {
  putteTestResponder({ to: 'you', message: 'hej putte' })

  expect(theFakeChannel).toEqual({
    to: 'you',
    message: 'Hej, jag heter putte och är en bot'
  })
})

test('responder should not respond to "testFakeMess"'),
  () => {
    theFakeChannel = null

    putteTestResponder({ to: 'whoever', message: 'fakeTestMessage' })

    expect(theFakeChannel).toEqual()
  }
