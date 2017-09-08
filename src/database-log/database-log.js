/** Log and retrieve from database */
'use strict'

const R = require('ramda')
const sqlite3 = require('sqlite3').verbose()

/**
 * Create database object
 *
 * @sig createDbLogger :: String -> Objekt
 */
const createDbLogger = dbFile => new sqlite3.Database(dbFile)

/**
 * Create log table if it does not exists
 *
 * @sig createLogTable ::
 */
const createLogTable = db => {
  db.run(`
  CREATE TABLE IF NOT EXISTS log (
    id INTEGER PRIMARY KEY NOT NULL,
    \`time\` INT,
    \`to\` TEXT,
    \`from\` TEXT,
    \`message\` TEXT
  )
`)
}

const logMessage = R.curry((db, { time, to, from, message }) =>
  db
    .prepare('INSERT INTO log VALUES (?, ?, ?, ?)')
    .run([time, to, from, message])
)

// Try fluture

const retrieveFullLog = db => null

const retrieveLast15 = db => null

module.exports = {
  createDbLogger,
  createLogTable,
  logMessage,
  retrieveFullLog,
  retrieveLast15
}
