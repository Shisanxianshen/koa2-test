// 文章模块
const db = require("../database/index.js")
const fs = require("fs")
const path = require("path")
const pathResolve = require("../utils/pathResolve")

// 保存文章
const saveArticle = async (ctx) => {
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
    `SELECT * FROM article` +
      (!ctx.request.body.module
        ? ""
        : ` WHERE module = '${ctx.request.body.module}'`) + ' ORDER BY id DESC'
  ).catch((err) => {
    throw err
  })
  ctx.body = {
    code: 0,
    data: data.map(item => {
      delete item.content
      return item
    }),
  }
}

// 获取文章详情
const getArticleDetail = async ctx => {
  const data = await db(`SELECT * FROM article WHERE id = '${ctx.request.url.split('/').pop()}'`).catch(err => {
    throw err
  })
  ctx.body = {
    code:0,
    data:data[0],
  }
}

module.exports = {
  "POST/saveArticle": saveArticle,
  "POST/uploadImage": uploadImage,
  "POST/deleteImage": deleteImage,
  "POST/getArticleList": getArticleList,
  "POST/getArticleDetail/:id": getArticleDetail,
}
