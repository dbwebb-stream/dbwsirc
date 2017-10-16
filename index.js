/** Irc bot, express server, socket.io.*/
"use strict";

// Includes
const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const irc = require("irc");
const most = require("most");

const { botSettings, appSettings } = require("./config");
const log = require("./src/logger/logger");
const db = require("./src/database-log/database-log");
const { normalizeMessage } = require("./src/irc2stream/normalize-message");
const { createPutteAnswerStream } = require("./src/putte-answer/putte-answer");
const {
    // messageToConsole,
    isChannelMessage
} = require("./src/irc2stream/irc2stream");

process.title = appSettings.processTitle;

/////////////////////////////////////////////////////////////////////
// Create the IRC bot and message handler
//

const putte = new irc.Client(botSettings.server, botSettings.nickname, botSettings.options);

/**
 * Create sqlite database object
 */
const dblog = db.createDbLogger(appSettings.dblog);

/**
 * Save to database log
 *
 * @sig saveDbLog :: NormalizedMessage -> void
 */
const dbLogMessage = db.logMessage(dblog);

/////////////////////////////////////////////////////////////////////
// Setup bot listeners
//

/**
 * @sig putteAnswerStream :: NormalizedMessage -> Stream
 */
const putteAnswerStream = createPutteAnswerStream(botSettings.nickname, putte.say.bind(putte));

/**
 * Use most.js to handle irc message stream.
 */
most
    .fromEvent("message", putte)
    .map(([from, to, message]) => normalizeMessage(from, to, message))
    // .tap(messageToConsole)
    .filter(isChannelMessage)
    .chain(nm => most.merge(most.of(nm), putteAnswerStream(nm)))
    .tap(dbLogMessage)
    .forEach(nm => io.emit("message", nm));

putte.addListener("registered", log.c("Registered: "));

putte.addListener("error", log.e("Bot error: "));

/////////////////////////////////////////////////////////////////////
// Express server and socket stuff
//

app.set("view engine", "pug");

// Serve index.html
app.get("/", (req, res) => {
    db
        .descendingHistory(dblog, 1)
        .then(latest => {
            res.render("info.pug", {
                botSettings: JSON.stringify(botSettings, null, 2),
                latest: latest[0],
                history: `http://${appSettings.ip}:${appSettings.port}/history/99`
            });
        })
        .catch(err => {
            log.e("Error showing info page:\n")(err);
            res.status(500).json({ error: err });
        });
});

// Send bot settings
app.get("/botsettings", (req, res) => {
    res.json(botSettings);
});

// Retrieve history from now
app.get("/history/:max(\\d+)", (req, res) => {
    const maxMessages = req.params.max;

    db
        .descendingHistory(dblog, maxMessages)
        .then(rows => {
            res.json(rows);
        })
        .catch(err => {
            log.e("History error from sql: ")(err);
            res.status(500).json({ error: err });
        });
});

// Socket
io.on("connection", socket => {
    log.c("incoming connection, handshake:")(socket.handshake);

    socket.on("disconnect", () => {
        log.c("connection closed, handshake:")(socket.handshake);
    });
});

// Start listening
http.listen(1337, () => {
    log.c(`listening on ${appSettings.ip}:${appSettings.port}`)("");
});
