// 数据库连接
const mysql = require("mysql")

let db = mysql.createConnection({
  host:'39.106.174.56',
  user: "dmg",
  password: "ymf961016",
  database: "dmg",
})
// 每一小时ping一次，如果出现错误则说明连接断开，重新连接即可
function createConnect(){
  let pinInterval = null
  if(pinInterval){
    clearInterval(pinInterval)
  }
  pinInterval = setInterval(function () {
    db.ping((err) => {
      if (err) {
        db.connect()
      }
    })
  }, 36000)
}
createConnect()
db.connect()

// 封装db.query
const query = function (sql){
  return new Promise((res,rej)=>{
    db.query(sql,(err,result)=>{
      if(err){
        rej(err)
      }else{
        res(JSON.parse(JSON.stringify(result)))
      }
    })
  })
}

module.exports = query
