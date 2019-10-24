var Router = require('koa-router')
var router = new Router()
var user_controller = require('./../../controllers/user_controller')

router.post('/h5/regist',user_controller.regist)
router.post('/h5/login',user_controller.login)
router.get('/h5/getCodeImage',user_controller.getCodeImg)

module.exports = router