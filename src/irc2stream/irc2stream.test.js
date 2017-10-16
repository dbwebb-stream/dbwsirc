/** Test normalize-message module */
/* global test, expect */
"use strict";
const i2s = require("./irc2stream");

test("should be channel message", () => {
    expect(i2s.isChannelMessage({ to: "#awesomeChannel" })).toBeTruthy();
});

test("should not be channel message", () => {
    expect(i2s.isChannelMessage({ to: "theBotItself" })).toBeFalsy();
});
