const path = require('path')

module.exports = function pathResolve (str) {
  return str.split(path.sep).join('/')
}