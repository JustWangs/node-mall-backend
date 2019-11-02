var Router = require('koa-router')
var router = new Router()
var static_controller = require('../../../controllers/admin/static_controller')

router.post('/admin/newBanner',static_controller.newBanner)
router.post('/admin/updateNotice',static_controller.updateNotice)

module.exports = router
