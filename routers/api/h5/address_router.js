var Router = require('koa-router')
var router = new Router()
var address_controller = require('../../../controllers/h5/address_controller')
var verify = require('../../../middleware/verify')

router.post('/h5/createAddress',verify,address_controller.createAddress)
router.post('/h5/userAddress',verify,address_controller.userAddress)
router.post('/h5/updateAddress',verify,address_controller.updateAddress)
router.post('/h5/delAddress',verify,address_controller.delAddress)
module.exports = router
