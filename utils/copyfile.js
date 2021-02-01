const fs = require('fs')
const db = require("../database/index.js")
// 返回文件路径
const copyFile = async function(ctx, entryPath, outPath){
  const readfile = fs.createReadStream(entryPath)
  const outfile = fs.createWriteStream(outPath)
  readfile.pipe(outfile)
  const hasHead = await db(`SELECT * FROM user WHERE id='${ctx.request.url.split('/').pop()}'`).catch(err => err)
  if(hasHead[0].head){
    fs.unlinkSync(hasHead[0].head)
  }
  // 先更新用户的新头像再更新讨论区的用户的新头像
  db(`UPDATE user SET head='${outPath}' WHERE id='${ctx.request.url.split('/').pop()}'`).catch(err => console.log(err))
  db(`UPDATE discuss SET head='${outPath}' WHERE userEmail='${hasHead[0].email}'`).catch(err => console.log(err))
}
module.exports = copyFile