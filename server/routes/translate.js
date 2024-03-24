const router = require('koa-router')()
const { auth } = require('../middlewares/auth.middleware')
const { textTran, deleteTextTranslationById, getTextHistorage
  , picTran, getPicHistorage, audioTran,getAudioHistorage } = require('../controllers/translate.controller')

router.prefix('/translate')

router.get('/textTranslate', auth, textTran)

router.delete('/deleteTextById/:id', auth, deleteTextTranslationById)

router.get('/getTextHistory', auth, getTextHistorage)

router.post('/picTranslate', auth, picTran)

router.get('/getPicHistory', auth, getPicHistorage)

router.post('/audioTranslate', auth, audioTran)

router.get('/getAudioHistory', auth, getAudioHistorage)


module.exports = router
