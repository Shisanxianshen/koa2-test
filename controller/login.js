const db = require("../database/index.js")
const transporter = require("../sendMail/index")
const jwt = require("../utils/token")
const fs = require("fs")
const path = require("path")
const copyFile = require("../utils/copyfile")
// 登录验证
const login_fn = async (ctx, next) => {
  let data = await db(
    `SELECT * FROM user WHERE email = '${ctx.request.body.email}' AND password = '${ctx.request.body.password}'`
  ).catch((err) => err)
  if (data.length === 0) {
    ctx.body = {
      code: 1001,
      msg: "账号不存在或密码错误",
    }
  } else {
    let params = {
      name: data[0].name,
      email: data[0].email,
      id: data[0].id,
      head: data[0].head,
    }
    ctx.body = {
      code: 0,
      token: jwt.createToken(params),
    }
  }
}
// 获取用户信息
const getUserInfo = async (ctx, next) => {
  let data = await db(
    `SELECT * FROM user WHERE email = '${ctx.request.userInfo.email}'`
  ).catch((err) => err)
  ctx.body = {
    code: 0,
    data: data[0],
  }
}

// 注册
const register_fn = async (ctx, next) => {
  // 验证码检测：
  const codeData = await db(
    `SELECT * FROM email WHERE email = '${ctx.request.body.email}'`
  ).catch((err) => console.log(err))
  let nowTimer = (new Date().getTime() / 1000) >> 0
  if (
    ctx.request.body.code != codeData[0].code ||
    nowTimer - codeData[0].timer > 60
  ) {
    ctx.body = {
      code: 1001,
      msg: "验证码已失效或错误",
    }
    return
  }
  // 如果返回空数组，则注册
  let data = await db(
    `SELECT * FROM user WHERE email = '${ctx.request.body.email}'`
  ).catch((err) => {
    ctx.body = {
      code: 500,
      msg: "注册失败",
    }
  })
  if (!data.length) {
    data = await db(
      `INSERT INTO user (email, password, name) VALUES ('${ctx.request.body.email}', '${ctx.request.body.password}', '${ctx.request.body.name}')`
    ).catch((err) => {
      console.log(err)
    })
    let params = {
      name: ctx.request.body.name,
      email: ctx.request.body.email,
      id: data.insertId,
      head: null,
    }
    ctx.body = {
      code: 0,
      token: jwt.createToken(params),
    }
  } else {
    ctx.body = {
      code: 1001,
      msg: "账号已存在",
    }
  }
}
// 发送验证码
const getCode_fn = async (ctx, next) => {
  //验证码存入数据库
  let code = Math.random().toFixed(6).slice(-6)
  const data = await db(
    `SELECT * FROM email WHERE email = '${ctx.request.body.email}'`
  ).catch((err) => {
    console.log(err)
  })
  // 发送验证码时间，code存入数据库
  if (!data.length) {
    await db(
      `INSERT INTO email (code, email, timer) VALUES ('${code}', '${
        ctx.request.body.email
      }', '${(new Date().getTime() / 1000) >> 0}')`
    ).catch((err) => console.log(err))
  } else {
    await db(
      `UPDATE email SET code='${code}', timer='${
        (new Date().getTime() / 1000) >> 0
      }' WHERE email = '${ctx.request.body.email}'`
    ).catch((err) => console.log(err))
  }
  transporter.sendMail({
    from: "15163575932@163.com",
    to: ctx.request.body.email,
    subject: "dmg的个人小站邮箱验证码",
    text: `请在60s内填写邮箱验证码，${code}`,
  })
  ctx.body = {
    code: 0,
    data: "success",
  }
}

// 上传头像
const setHead = async (ctx, next) => {
  const file = ctx.request.files.file
  // 检测是否存在upload文件夹，如果没有就创建，有的话就将图片存入upload
  const fileList = fs.readdirSync(path.resolve(__dirname, "../../"))
  const outPath = path
    .resolve(__dirname, `../../upload/${Date.now() + file.name}`)
    .split(path.sep)
    .join("/")
  if (fileList.includes("upload")) {
    copyFile(ctx, file.path.split(path.sep).join("/"), outPath)
  } else {
    fs.mkdirSync(
      path.resolve(__dirname, "../../upload").split(path.sep).join("/")
    )
    copyFile(ctx, file.path.split(path.sep).join("/"), outPath)
  }
  ctx.body = {
    code: 0,
    data: "success",
    headSrc: outPath,
  }
}

module.exports = {
  "POST/user/login": login_fn,
  "POST/user/register": register_fn,
  "POST/user/getCode": getCode_fn,
  "POST/user/setHead/:id": setHead,
  "GET/getUserInfo": getUserInfo,
}
