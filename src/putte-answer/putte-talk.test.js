/** Test putteTalk module */
/* global test, expect */
const M = require("ramda-fantasy").Maybe;
const Just = M.Just;
const Nothing = M.Nothing;

const { putteResponseMapper, maybePutteResponse } = require("./putte-talk");

test('responseMapper should answer to "hej putte"', () => {
    expect(putteResponseMapper({ message: "hej putte!" })).toEqual(
        "Hej, jag heter putte och är en bot"
    );
});

test('responseMapper should answer to "putte hjälp")', () => {
    expect(putteResponseMapper({ message: "putte hjälp" })).toEqual(
        "Äh, jag kan ingenting. Be marvin."
    );
});

test("responseMApper should be undefined when no matching string", () => {
    expect(putteResponseMapper({ message: "randomstring" })).toBeUndefined();
});

test('should be Maybe when maybePutteResponse with "hej putte', () => {
    expect(maybePutteResponse({ message: "hej putte" })).toEqual(
        Just("Hej, jag heter putte och är en bot")
    );
});

test('should be Nothing when maybePutteResponse with "blaj', () => {
    expect(maybePutteResponse({ message: "blaj" })).toEqual(Nothing());
});
