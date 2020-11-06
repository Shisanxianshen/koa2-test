const db = require("../database/index.js")
const transporter = require("../sendMail/index")
const jwt = require("../utils/token")
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
    }
    ctx.body = {
      code: 0,
      token: jwt.createToken(params),
    }
  }
}
// 获取用户信息
const getUserInfo = async (ctx, next) => {
  ctx.set('Cache-Control','no-catch')
  ctx.cookies.set('check','3760314830')
  ctx.body = {
    code: 0,
    data: ctx.request.userInfo,
  }
}

// 注册
const register_fn = async (ctx, next) => {
  // 验证码检测：
  const codeData = await db(`SELECT * FROM email WHERE email = '${ctx.request.body.email}'`).catch(err => console.log(err))
  let nowTimer = new Date().getTime()/1000 >> 0
  if(ctx.request.body.code != codeData[0].code || nowTimer - codeData[0].timer > 60){
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

module.exports = {
  "POST/user/login": login_fn,
  "POST/user/register": register_fn,
  "POST/user/getCode": getCode_fn,
  "GET/getUserInfo": getUserInfo,
}
