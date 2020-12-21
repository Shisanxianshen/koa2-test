const db = require("../database/index.js")

// 新增评论
const saveDiscuss = async (ctx,next) => {
  const data = await db(`INSERT INTO discuss (content,userEmail,parentId,discussFrom,reviewId,name,head) VALUES ('${ctx.request.body.content}','${ctx.request.userInfo.email}','${ctx.request.body.parentId}','${ctx.request.body.from}','${ctx.request.body.reviewId}','${ctx.request.userInfo.name}','${ctx.request.userInfo.head}')`).catch(err => err)
  ctx.body = {
    code:0,
    data:'success',
  } 
}
// 列表查询
const discussList = async (ctx,next) =>{
  const data = await db(`SELECT * FROM discuss WHERE discussFrom = '${ctx.request.body.discussFrom}'`).catch(err => err)
  ctx.body = {
    code:0,
    data:data,
  }
}
module.exports = {
  "POST/saveDiscuss":saveDiscuss,
  "POST/user/discussList":discussList,
}