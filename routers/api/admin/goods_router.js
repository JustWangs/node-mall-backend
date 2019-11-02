var Router = require('koa-router')
var router = new Router()
var goods_controller = require('../../../controllers/admin/goods_controller')

router.post('/admin/createGoods',goods_controller.createGoods)

module.exports = router
