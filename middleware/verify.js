/**
 *  token verify 
 */

const config = require('./../config')
const jwt = require('jsonwebtoken')

module.exports = async(ctx,next)=> {
    const reqToken = ctx.get('Authorization')
    if(reqToken == '') {
        ctx.status = 402
        ctx.body = {
            data: {
                code: 402,
                msg: '没有携带身份认证'
            }
        }
        return
    }
    let verifyToken;
    try {
        verifyToken = await jwt.verify(reqToken, config.jwt.secret); // 验证
    }catch(err) {
        if ('TokenExpiredError' === err.name) {
            ctx.status = 401
            ctx.body = {
                data: {
                    code: 401,
                    msg: '身份认证已经过期，请重新登录'
                }
            }
            return
        }
        ctx.status = 402
        ctx.body = {
            data: {
                code: 402,
                msg: '身份认证错误'
            }
        }
        return
    }
    await next()
}