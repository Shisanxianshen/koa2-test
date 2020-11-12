// 使用邮箱验证功能（发送验证码）
const nodemailer = require("nodemailer")
let transporter = nodemailer.createTransport({
  host:'smtp.163.com',//使用内置的163发送邮件
  auth: {
    user: "15163575932@163.com",
    pass: "SJPLBCHBKHIIQCLF",
  },
})
// 邮件服务器准备
transporter.verify(function (error, success) {
  if (error) {
    console.log(error)
  }else{
    console.log('Server is ready')
  }
})

// transporter.sendMail({
//   from:'15163575932@163.com',
//   to:'1161015103@qq.com',
//   subject:'dmg的个人小站邮箱验证码',
//   text:`请在60s内填写邮箱验证码，${433100}`,
// },function(){
//   console.log('邮件已发送')
// })

module.exports = transporter
  