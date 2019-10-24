var Koa = require('koa')

var config = require('./config')

var mongoInstance = require('./mongoConfig')(config.db)

var bodyParser = require('koa-bodyparser')

var session = require('koa-session')

const app = new Koa()

app.use(bodyParser())

app.keys = ['some secret hurr'];

app.use(session(config.session, app));

const user_router = require('./routers/api/user_router')

app.use(user_router.routes()).use(user_router.allowedMethods())

app.listen(config.port)