const router = require('koa-router')()
const { sendEmailCode, register, login, RefreshToken } = require('../controllers/user.controller')
const { userValidator, verifyUser, cryptPassword, verifyLogin } = require('../middlewares/user.middleware')
const { auth } = require('../middlewares/auth.middleware')

router.prefix('/users')

router.get('/', function (ctx, next) {
  ctx.body = 'this is a users response!'
})
router.get('/sendEmailCode',sendEmailCode)

router.post('/register', userValidator, verifyUser, cryptPassword, register)

router.post('/login', userValidator, verifyLogin, login)

router.get('/refreshToken', RefreshToken)

module.exports = router
