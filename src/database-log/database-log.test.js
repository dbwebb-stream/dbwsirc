/** Test database-log module */
/* global test, expect */
const sqlite3 = require("sqlite3").verbose();
const db = require("./database-log.js");

const testMessage = {
    time: 1111,
    to: "#channel",
    from: "whoever",
    message: "whatever"
};

/** Drop table test helper */
// const dropTable = db => {
//     db.run("DROP TABLE log");
// };

test("create db should work", () => {
    expect(db.createDbLogger(":memory:")).toBeInstanceOf(sqlite3.Database);
});

test("should log message", done => {
    const dblog = db.createDbLogger(":memory:");

    dblog.serialize(() => {
        db.logMessage(dblog, testMessage);

        dblog.get("select * from log", (err, row) => {
            if (err) {
                console.log("Error: ", err);
            }
            const messFromDb = {
                time: row.time,
                to: row.to,
                from: row.from,
                message: row.message
                // message: ''
            };

            expect(messFromDb).toEqual(testMessage);
            done();
        });
    });
});

test("should be able to store and then query database", done => {
    const dblog = db.createDbLogger(":memory:");

    dblog.serialize(() => {
        db.logMessage(dblog, testMessage);
        const sql = "SELECT * FROM log ORDER BY `time` desc LIMIT ?";

        db
            .query(dblog, sql, [1])
            .then(rows => {
                const messFromDb = {
                    time: rows[0].time,
                    to: rows[0].to,
                    from: rows[0].from,
                    message: rows[0].message
                    // message: ''
                };

                expect(messFromDb).toEqual(testMessage);
                done();
            })
            .catch(err => {
                console.error(err);
            });
    });
});
