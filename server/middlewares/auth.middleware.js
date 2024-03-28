const jwt = require('jsonwebtoken')
const { JWT_SECRET } = process.env;

const {
  tokenExpiredError,
  invalidToken,
  hasNotAdminPermission,
} = require('../constants/err.type')

const { getVoiceTranslations } = require('../services/media.service')

const auth = async (ctx, next) => {
  const { authorization = "" } = ctx.request.headers;
  const token = authorization.replace('Bearer ', '');

  try {
    // user中包含了payload的信息(id, user_name, is_admin)
    const user = jwt.verify(token, JWT_SECRET)
    ctx.state.user = user
  } catch (err) {
    switch (err.name) {
      case 'TokenExpiredError':
        console.error('token已过期', err)
        return ctx.app.emit('error', tokenExpiredError, ctx)
      case 'JsonWebTokenError':
        console.error('无效的token', err)
        return ctx.app.emit('error', invalidToken, ctx)
    }
  }

  await next()
}
const hasCache = async (ctx, next) => {
  const { ifModifiedSince, authorization = "" } = ctx.request.headers;
  console.log("ifModifiedSince",ifModifiedSince);

  try {
    const token = authorization.replace('Bearer ', '');
    const decodedToken = await jwt.verify(token, JWT_SECRET);
    const userId = decodedToken.id;
    const result = await getVoiceTranslations(1,1,userId)
    console.log("getVoiceTranslations",result);
    if (ifModifiedSince && new Date(result.records[0].updatedAt).getTime()<=new Date(ifModifiedSince).getTime()) {
        ctx.status = 304;
        ctx.body = {
          code : 0,
          message:"数据未变化",
          result:{}
        }
    }
  } catch (error) {
    console.log("hasCache",error);
  }
  await next()
}


module.exports = {
  auth,
  hasCache
}
