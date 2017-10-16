/** Normalize a message */
"use strict";
const R = require("ramda");
/**
 * Return seconds since Epoch
 *
 * @sig unixNowSeconds :: Number
 */
const unixNowSeconds = () => Math.floor(Date.now());

/**
 * Construct a message according to architecture spec
 *
 * Example normalized message
 * {
 *   "service": "irc",
 *   "serviceId": "irc-putte-v0.0.1"
 *   "time": 1504276618,
 *   "to": "#db-o-webb",
 *   "from": "litemerafrukt",
 *   "fromImageUrl": null,
 *   "message": "Säg hej till putte, han bara lyssnar på kanalen",
 *   "meta": null,
 *   "original": null
 * }
 *
 * @sig _normalizeMessage :: ((() -> Number), String, String, String) -> Object
 */
const _normalizeMessage = R.curry((time, from, to, message) => ({
    service: "irc",
    serviceId: "irc-putte-v0.0.1",
    time: time(),
    to: to,
    from: from,
    fromImageUrl: null,
    message: message,
    meta: null,
    original: null
}));

/**
 * Normalized message with bound time function
 *
 * @sig normalizedMessage :: (String, String, String) -> Object
 */
const normalizeMessage = _normalizeMessage.bind(null, unixNowSeconds);

module.exports = { _normalizeMessage, normalizeMessage };
