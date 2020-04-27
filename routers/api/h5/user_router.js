var Router = require('koa-router')
var router = new Router()
var user_controller = require('../../../controllers/h5/user_controller')
var Qiniu =require('../../../controllers/qiniu')
var verify = require('../../../middleware/verify')

router.post('/h5/regist',user_controller.regist)
router.post('/h5/login',user_controller.login)
router.get('/h5/getCodeImage',user_controller.getCodeImg)
router.get('/h5/uploadtoken',verify,Qiniu.uploadToken) 
router.post('/h5/updateUserAvatar',verify,user_controller.changeUserAvatar)
router.get('/h5/getBannerNotice',user_controller.getBannerNotice)
router.post('/h5/addToCollection',verify,user_controller.addToCollection)
router.post('/h5/delCollection',verify,user_controller.delCollection)

module.exports = router 