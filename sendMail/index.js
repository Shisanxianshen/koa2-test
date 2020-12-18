// 使用邮箱验证功能（发送验证码）
const nodemailer = require("nodemailer")
let transporter = nodemailer.createTransport({
  host:'smtp.163.com',//使用内置的163发送邮件
  secure: true,
  auth: {
    user: "15163575932@163.com",
    pass: "VSFGFMZVREDBZHNQ",
  },
})
// 邮件服务器准备
// transporter.verify(function (error, success) {
//   if (error) {
//     console.log(error)
//   }else{
//     console.log('Server is ready')
//   }
// })

module.exports = transporter
  