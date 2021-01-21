const jwt = require("jsonwebtoken")
const fs = require('fs')
const path = require('path')
const pubkey = fs.readFileSync(path.join(__dirname,'../key/pub.pem'))
const prikey = fs.readFileSync(path.join(__dirname,'../key/pri.pem'))
const secert = "ymf961016"
function createToken(data = {}) {
  return jwt.sign(data, prikey, { algorithm: 'RS256'})
}

function checkToken(token) {
  // console.log(token)
  // console.log(Buffer.from(token.split(".")[1], "base64"))
  return new Promise((resolve, reject) => {
    jwt.verify(token, pubkey, (err, decode) => {
      if (err) {
        reject(err)
      } else {
        resolve(decode)
      }
    })
  })
}

module.exports = {
  createToken,
  checkToken,
}
