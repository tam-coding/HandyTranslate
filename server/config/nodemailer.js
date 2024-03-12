const nodemailer = require('nodemailer')

const {EMAIL_HOST,EMAIL_PASS} = process.env
const transporter = nodemailer.createTransport({
  // 默认支持的邮箱服务包括：”QQ”、”163”、”126”、”iCloud”、”Hotmail”、”Yahoo”等
  service: "QQ",
  auth: {
      // 发件人邮箱账号
      user: EMAIL_HOST,
      //发件人邮箱的授权码 需要在自己的邮箱设置中生成,并不是邮件的登录密码
      pass: EMAIL_PASS
  }
})





module.exports = {transporter}