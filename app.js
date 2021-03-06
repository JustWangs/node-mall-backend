var Koa = require('koa')

var config = require('./config')

var cors = require('koa2-cors')

var mongoInstance = require('./mongoConfig')(config.db)

var bodyParser = require('koa-bodyparser')

var session = require('koa-session')

const app = new Koa()

app.use(bodyParser())

app.use(cors({
    origin: function (ctx) {
        if (ctx.url === '/test') {
            return "*"; // 允许来自所有域名请求
        }
        return 'http://localhost:8080';
    },
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
    maxAge: 5,
    credentials: true,
    allowMethods: ['GET', 'POST', 'DELETE'],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
}))

app.keys = ['some secret hurr'];

app.use(session(config.session, app));

// h5
const user_router = require('./routers/api/h5/user_router')
const address_router = require('./routers/api/h5/address_router')
const getGoods_router = require('./routers/api/h5/goods_router')

app.use(user_router.routes()).use(user_router.allowedMethods())
app.use(address_router.routes()).use(address_router.allowedMethods())
app.use(getGoods_router.routes()).use(getGoods_router.allowedMethods())

// =================================================================
// =================================================================

// admin
const static_router = require('./routers/api/admin/static_router')
const goods_router = require('./routers/api/admin/goods_router')

app.use(static_router.routes()).use(static_router.allowedMethods())
app.use(goods_router.routes()).use(goods_router.allowedMethods())


app.listen(config.port)