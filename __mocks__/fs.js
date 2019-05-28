'use strict'
const fs = jest.genMockFromModule('fs');
function existsSync(val) {
    return val.indexOf('dracula.test.config.js')!==-1
}
fs.existsSync = existsSync;
module.exports = fs;