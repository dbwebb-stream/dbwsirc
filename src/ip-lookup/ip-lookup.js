/** Function to get ip on machine running script */
const dns = require("dns");
const os = require("os");

const promiseMyIp = () => {
    return new Promise((resolve, reject) =>
        dns.lookup(os.hostname(), (err, address) => {
            if (err) {
                reject(err);
            }
            resolve(address);
        })
    );
};

module.exports = { promiseMyIp };
