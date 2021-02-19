// 文章模块
const db = require("../database/index.js")
const fs = require("fs")
const path = require("path")
const pathResolve = require("../utils/pathResolve")

// 保存文章
const saveArticle = async (ctx) => {
  if(ctx.request.body.author !== 'dmg'){
    ctx.body = {
      msg:'没有权限发布文章！'
    }
    return
  }
  const data = await db(
    `INSERT INTO article (title,content,module,author,introduce) VALUES ('${ctx.request.body.title}','${ctx.request.body.content}','${ctx.request.body.module}','${ctx.request.body.author}','${ctx.request.body.introduce}')`
  ).catch((err) => {
    throw err
  })
  ctx.body = {
    code: 0,
    data: "success",
  }
}

// 上传图片
const uploadImage = async (ctx) => {
  const image = ctx.request.files.image
  const imagePath = pathResolve(image.path)
  const outputPath = path
    .resolve(__dirname, `../../article/${Date.now()}${image.name}`)
    .split(path.sep)
    .join("/")
  // 检测是否存在article文件夹，如果不存在就创建
  const fileList = fs.readdirSync(path.resolve(__dirname, "../../"))
  const readeFile = fs.createReadStream(imagePath)
  const outFile = fs.createWriteStream(outputPath)
  if (fileList.includes("article")) {
    readeFile.pipe(outFile)
  } else {
    fs.mkdirSync(pathResolve(path.resolve(__dirname, "../../article")))
    readeFile.pipe(outFile)
  }
  ctx.body = {
    code: 0,
    url: outputPath,
  }
}

// 删除图片
const deleteImage = async (ctx) => {
  fs.unlinkSync(ctx.request.body.url)
  ctx.body = {
    code: 0,
    data: "success",
  }
}

// 获取文章列表
const getArticleList = async (ctx) => {
  const data = await db(
    `SELECT id, title, module, author, introduce FROM article` +
      (!ctx.request.body.module
        ? ""
        : ` WHERE module = '${ctx.request.body.module}'`) +
      ` ORDER BY id DESC LIMIT ${ctx.request.body.pageSize} OFFSET ${ctx.request.body.page * ctx.request.body.pageSize}`
  ).catch((err) => {
    throw err
  })
  const total = await db(
    `SELECT COUNT(*) num FROM article` +
      (!ctx.request.body.module
        ? ""
        : ` WHERE module = '${ctx.request.body.module}'`)
  ).catch(err => {
    throw err
  })
  ctx.body = {
    code: 0,
    data: data,
    total: total[0].num,
  }
}

// 获取文章详情
const getArticleDetail = async (ctx) => {
  const data = await db(
    `SELECT * FROM article WHERE id = '${ctx.request.url.split("/").pop()}'`
  ).catch((err) => {
    throw err
  })
  ctx.body = {
    code: 0,
    data: data[0],
  }
}

module.exports = {
  "POST/saveArticle": saveArticle,
  "POST/uploadImage": uploadImage,
  "POST/deleteImage": deleteImage,
  "POST/user/getArticleList": getArticleList,
  "POST/user/getArticleDetail/:id": getArticleDetail,
}
