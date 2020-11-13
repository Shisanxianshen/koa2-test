const koa = require('koa')
const cors = require('koa2-cors')
const router = require('koa-router')()
const bodyParse = require('koa-bodyparser')
const fs = require('fs')
const jwt = require('./utils/token')
const history = require('koa2-connect-history-api-fallback')
// 获得本机host地址
const app = new koa()
app.use(cors({
  credentials: true,
}))
app.use(history())
// 对于不同模块请求进行处理
let file = fs.readdirSync(__dirname + '/controller')
let taskMoulde = file.filter((f)=>{
  if(/\.js/.test(f)){
    return f
  }
})
let taskList = []
// 导入所有js
taskMoulde.forEach(item => {
  taskList.push(require(__dirname + '/controller/' + item)) 
})
// 集中处理请求（对于user不进行检测token）
app.use(async(ctx,next)=>{
  if(ctx.request.url.includes('/user')){
    await next()
    return
  }
  const data = await jwt.checkToken(ctx.request.header.authorization).catch(err =>{
    ctx.body = {
      code: 1004,
      msg:'请先登录',
    }
  })
  if(data){
    ctx.request.userInfo = data
    await next()
  }
})

taskList.forEach(item =>{
  for(let i in item){
    if(/^POST\//.test(i)){
      router.post(i.substring(4),item[i])
    }
    if(/^GET\//.test(i)){
      router.get(i.substring(3),item[i])
    }                
  }   
})
app.use(bodyParse())
app.use(router.routes())
app.listen(3011)