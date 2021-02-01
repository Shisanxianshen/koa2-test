// 文章模块
const db = require("../database/index.js")
const fs = require('fs')
const path = require('path')
const copyFile = require('../utils/copyfile')

const saveArticle = async (ctx) => {
  const data = await db(`INSERT INTO article (title,content,module,author) VALUES ('${ctx.request.body.title}','${ctx.request.body.content}','${ctx.request.body.module}','${ctx.request.body.author}')`).catch(err => err)
  ctx.body = {
    code:0,
    data:'success',
  }
}

const uploadImage = async (ctx) => {
  const image = ctx.request.files.image
  const outputPath = path.resolve(__dirname,`../../article/${Date.now()}${image.name}`).split(path.sep).join('/')
  // 检测是否存在article文件夹，如果不存在就创建
  
  
}

module.exports = {
  'POST/saveArticle':saveArticle,
  'POST/uploadImage':uploadImage,
}


