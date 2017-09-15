/** Function to get ip on machine running script */
const dns = require('dns')
const os = require('os')

require('dns').lookup(require('os').hostname(), (err, add, fam) => {
  console.log('addr: ' + add)
})
