const { transporter } = require('../config/nodemailer')
const { EMAIL_HOST, JWT_SECRET,JWT_REFRESH_SECRET } = process.env
const { createUser, getUserInfo } = require('../services/user.service')
const { userRegisterError } = require('../constants/err.type')
const jwt = require('jsonwebtoken')
const {
  tokenExpiredError,
  invalidToken,
} = require('../constants/err.type')
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

    const { user_name, password, email, code, is_admin } = ctx.request.body;

    // 检查验证码是否存在
    if (!emailVerificationCodes.has(email)) {
      ctx.app.emit('error', {
        code: '10001',
        message: '请先获取验证码',
        result: '',
      }, ctx);
      return;
    }

    // 检查验证码是否匹配
    const verificationCode = emailVerificationCodes.get(email);
    if (verificationCode.code !== code) {
      ctx.app.emit('error', {
        code: '10002',
        message: '验证码不正确',
        result: '',
      }, ctx);
      return;
    }

    // 检查验证码是否过期
    if (verificationCode.expireTime < new Date()) {
      ctx.app.emit('error', {
        code: '10003',
        message: '验证码已过期',
        result: '',
      }, ctx);
      return;
    }

    // 验证通过之后删除验证码
    // emailVerificationCodes.delete(email);

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
      const { password, ...res } = await getUserInfo({ email });
      console.log("user", res);
      if (res) {
        const token = jwt.sign(res, JWT_SECRET, { expiresIn: '1m' });
        const decodedToken = jwt.decode(token);
        const expirationDate = new Date(decodedToken.exp * 1000);
        ctx.body = {
          code: 0,
          message: '登录成功',
          result: {
            token,
            tokenExpire: expirationDate,
            user_name: res.user_name,
            email: res.email,
            is_admin: res.is_admin,
            id: res.id,
            refreshToken : jwt.sign(res , JWT_REFRESH_SECRET, { expiresIn: '7d' })

          }
        }
      }
    } catch (error) {

    }
  }


  async RefreshToken(ctx, next) {
    const { refreshToken } = ctx.query
    console.log("RefreshToken", refreshToken);
    console.log("ctx.query", ctx.query);

    if (!refreshToken) {
      console.error('无法获取参数RefreshToken')
      return ctx.app.emit('error', invalidToken, ctx)
    }
    try {
      // user中包含了payload的信息(id, user_name, is_admin)
      const { email } = jwt.verify(refreshToken, JWT_REFRESH_SECRET)
      const { password, ...res } = await getUserInfo({ email });
      if (res) {
        const token = jwt.sign(res, JWT_REFRESH_SECRET, { expiresIn: '1m' });
        const decodedToken = jwt.decode(token);
        const expirationDate = new Date(decodedToken.exp * 1000);
        ctx.body = {
          code: 0,
          message: '更新token成功',
          result: {
            token,
            tokenExpire: expirationDate,
          }
        }
      }
    } catch (err) {
      switch (err.name) {
        case 'TokenExpiredError':
          console.error('token已过期', err)
          return ctx.app.emit('error', tokenExpiredError, ctx)
        case 'JsonWebTokenError':
          console.error('无效的token', err)
          return ctx.app.emit('error', invalidToken, ctx)
        default:
          return console.error(err)
      }
    }
    await next()
  }
}

module.exports = new Usercontroller();