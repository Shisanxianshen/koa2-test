const jwt = require('jsonwebtoken')

const secert = 'ymf961016'
function createToken(data = {}){
   return jwt.sign(data,secert)
}

function checkToken(token){
  return new Promise((resolve,reject)=>{
    jwt.verify(token,secert,(err,decode)=>{
      if(err){
        reject(err)
      }else{
        resolve(decode)
      }
    })
  })
}

module.exports = {
  createToken,
  checkToken
}