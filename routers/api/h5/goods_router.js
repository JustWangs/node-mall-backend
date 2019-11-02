var Router = require('koa-router')
var router = new Router()
var goods_controller = require('../../../controllers/h5/goods_controller')
var verify = require('../../../middleware/verify')

router.post('/h5/getGoodsByTags',verify,goods_controller.getGoodsByTags)
router.get('/h5/getALlTags',goods_controller.getALlTags)
router.post('/h5/goodsDetail',verify,goods_controller.goodsDetail)

module.exports = router
