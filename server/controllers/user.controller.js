const { transporter } = require('../config/nodemailer')
const { EMAIL_HOST, JWT_SECRET } = process.env
const { createUser, getUserInfo } = require('../services/user.service')
const { userRegisterError } = require('../constants/err.type')
const jwt = require('jsonwebtoken')
const emailVerificationCodes = new Map();


class Usercontroller {

  //发送验证码
  async sendEmailCode(ctx, next) {
    const { email } = ctx.query
    if (email && emailVerificationCodes.get(email)) {
      const latestTime = emailVerificationCodes.get(email).expireTime
      if (latestTime - new Date() > 1000 * 60 * 9) {
        console.log(latestTime - new Date() < 1000 * 60 * 9);
        ctx.app.emit('error', {
          code: '10000',
          message: '邮箱验证码发送过于频繁，一分钟内只能发送一次:',
          result: '',
        }, ctx)
        return console.log('发送失败:');
      }
    }
    console.log(ctx.query.email);
    const code = Math.random().toFixed(6).slice(-6)
    console.log("邮箱验证码", code);
    const expireTime = new Date();
    expireTime.setMinutes(expireTime.getMinutes() + 10);
    // 配置收件人信息
    const receiver = {
      // 发件人 邮箱  '昵称<发件人邮箱>'
      from: `handyTranslate <${EMAIL_HOST}>`,
      // 主题
      subject: '注册验证码',
      // 收件人 的邮箱 可以是其他邮箱 不一定是qq邮箱
      to: email,
      // 可以使用html标签
      html: `
        <h2>你好,你正在注册掌上译</h2>
        <div>您的验证码是<span style="font-weight: bold;color: #333;font-size:24px;">${code}</span>,请勿将验证码泄露给任何人！验证码将在${expireTime.toLocaleString()}过期。<div>
        `
    }
    // 发送邮件 
    try {
      const info = await transporter.sendMail(receiver)
      emailVerificationCodes.set(email, { code, expireTime });
      // 十分钟过期后删除验证码
      setTimeout(() => {
        emailVerificationCodes.delete(email);
        console.log(`验证码已过期并删除：${email}`);
      }, expireTime - Date.now());
      console.log('发送成功 info:', info.response)
      ctx.body = {
        code: 0,
        message: '邮箱验证码发送成功',
        result: {
          expireTime: expireTime.getTime(),
        },
      }
    } catch (error) {
      ctx.app.emit('error', {
        code: '10000',
        message: '邮箱验证码发送失败:' + error,
        result: '',
      }, ctx)
      return console.log('发送失败:', error);
    }

  }

  async register(ctx, next) {
    // todo 验证邮箱验证码
    const { user_name, password, email, code, is_admin } = ctx.request.body;
    try {
      const res = await createUser(user_name, email, password, is_admin)
      ctx.body = {
        code: 0,
        message: '注册成功',
        result: {
          id: res.id,
          user_name: res.user_name,
          email: res.email,
          is_admin: res.is_admin,
        }
      }
    } catch (error) {
      ctx.app.emit('error', userRegisterError, ctx)
      console.error(error);
    }
  }

  async login(ctx, next) {
    const { email, password } = ctx.request.body;
    try {
      const res = await getUserInfo({ email});
      if (res) {
        ctx.body = {
          code: 0,
          message: '登录成功',
          result: {
            token: jwt.sign(res, JWT_SECRET, { expiresIn: '1d' }),
          }

        }
      }
    } catch (error) {

    }
  }
}

module.exports = new Usercontroller();