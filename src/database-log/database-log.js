/** Log and retrieve from database */
"use strict";

const R = require("ramda");
const sqlite3 = require("sqlite3").verbose();

/**
 * Create log table if it does not exists
 *
 * @sig createLogTable :: Object -> void
 */
const createLogTable = db => {
    db.run(`
      CREATE TABLE IF NOT EXISTS log (
        id INTEGER PRIMARY KEY,
        \`time\` INT,
        \`to\` TEXT,
        \`from\` TEXT,
        \`message\` TEXT
      )
  `);
};

/**
 * Create database object
 *
 * @sig createDbLogger :: String -> Objekt
 */
const createDbLogger = dbFile => {
    const dblog = new sqlite3.Database(dbFile);
    // TODO: I do not know if this actually does what I want.
    // I want the program to halt until the table is created.
    // Preliminary test indicate that it doesn't.

    dblog.serialize(() => {
        createLogTable(dblog);
    });
    return dblog;
};

const logMessage = R.curry((db, { time, to, from, message }) => {
    db
        .prepare("INSERT INTO log (`time`, `to`, `from`, `message`) VALUES (?, ?, ?, ?)")
        .run([time, to, from, message]);
});

/**
 * Query database and get a Promise
 *
 * @sig query :: Object -> String -> Array -> Promise
 */
const query = R.curry((db, sql, param) => {
    return new Promise((resolve, reject) =>
        db.all(sql, param, (err, res) => {
            if (err) {
                reject(err);
            }
            resolve(res);
        })
    );
});

const descendingHistory = R.curry((db, max) => {
    const sql = "SELECT * FROM log ORDER BY `id` desc LIMIT ?";

    return query(db, sql, [max]);
});

module.exports = {
    createDbLogger,
    createLogTable,
    logMessage,
    query,
    descendingHistory
};
