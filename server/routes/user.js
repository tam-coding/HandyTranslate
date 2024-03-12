const router = require('koa-router')()
const { sendEmailCode, register, login } = require('../controllers/user.controller')
const { userValidator, verifyUser, cryptPassword, verifyLogin  } = require('../middlewares/user.middleware')

router.prefix('/users')

router.get('/', function (ctx, next) {
  ctx.body = 'this is a users response!'
})
router.get('/sendEmailCode', sendEmailCode)

router.post('/register', userValidator, verifyUser, cryptPassword, register)

router.post('/login', userValidator,verifyLogin,login)

module.exports = router
