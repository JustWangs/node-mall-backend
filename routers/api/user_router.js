var Router = require('koa-router')
var router = new Router()
var user_controller = require('./../../controllers/user_controller')
var Qiniu =require('./../../controllers/qiniu')
var verify = require('./../../middleware/verify')


router.post('/h5/regist',user_controller.regist)
router.post('/h5/login',user_controller.login)
router.get('/h5/getCodeImage',user_controller.getCodeImg)
router.get('/h5/uploadtoken',Qiniu.uploadToken) 
router.post('/h5/updateUserAvatar',user_controller.changeUserAvatar)

module.exports = router