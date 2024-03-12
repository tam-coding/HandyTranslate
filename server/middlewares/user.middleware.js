const {
  userFormateError,
  userAlreadyExited,
  userRegisterError,
  userDoesNotExist,
  userLoginError,
  invalidPassword,
} = require('../constants/err.type')

const { getUserInfo } = require('../services/user.service')
const bcrypt = require('bcryptjs')

const userValidator = async (ctx, next) => {
  const { user_name, password, email } = ctx.request.body;
  // 合法性
  if ( !password || !email) {
    console.error('密码或者邮箱为空', ctx.request.body)
    ctx.app.emit('error', userFormateError, ctx)
    return
  }
  await next()
}

const verifyUser = async (ctx, next) => {
  const {  email } = ctx.request.body
  const resEmail = await getUserInfo({email})
  try {
    if (resEmail != null) {
      console.error('邮箱已经被注册', { email })
      ctx.app.emit('error', userAlreadyExited, ctx)
      return
    }
  } catch (error) {
    console.error('获取用户信息错误', err)
    ctx.app.emit('error', userRegisterError, ctx)
    return
  }
  await next()
}

const cryptPassword = async (ctx, next) => {

  const { password } = ctx.request.body
  const salt = bcrypt.genSaltSync(10)
  const hash = bcrypt.hashSync(password, salt)
  ctx.request.body.password = hash
  await next()
}

const verifyLogin = async (ctx, next) => {
  const { email, password } = ctx.request.body;
  console.log("email",email);
  console.log("password",password);
  try {
    const result = await getUserInfo({email})
    //用户不存在
    if (!result) {
      ctx.app.emit('error', userDoesNotExist, ctx)
      return console.error('用户不存在', { email })
    }
    if (!bcrypt.compareSync(password, result.password)) {
      ctx.app.emit('error', invalidPassword, ctx)
      return console.error('账号密码不匹配')
    }

  } catch (error) {
    ctx.app.emit('error', userLoginError, ctx)
    return console.error('登录错误', error)
  }
  await next()
}

module.exports = {
  userValidator,
  verifyUser,
  cryptPassword,
  verifyLogin
}