/** Test normalize-message module */
/* global test, expect */
const _normalizeMessage = require("./normalize-message")._normalizeMessage;

const normalizeMessage = _normalizeMessage.bind(null, () => 0);

const resultingNormalizedMessage = {
    service: "irc",
    serviceId: "irc-putte-v0.0.1",
    time: 0,
    to: "#testchannel",
    from: "whoever",
    fromImageUrl: null,
    message: "This is fake!",
    meta: null,
    original: null
};

test("should return normalized message", () => {
    expect(normalizeMessage("whoever", "#testchannel", "This is fake!")).toEqual(
        resultingNormalizedMessage
    );
});
