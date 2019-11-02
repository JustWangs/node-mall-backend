const banner_Col = require('../../models/admin/banner')
const notice_Col = require('../../models/admin/notice')
const uuid = require('uuid')

/**
 * 新增banner
 * @param { String } userId
 * @param { String } url
 * @param { String } goodsId
 */
const newBanner = async (ctx,next)=> {
    var {userId,url,goodsId=''} = req = ctx.request.body
    if(!userId || !url|| !goodsId) {
        ctx.status = 401
        ctx.body = {
            data: {
                code: 401,
                msg: 'error'
            }
        }
        return
    }

    try {
        req.id = uuid.v1()
        req.createTime = Date.parse(new Date())
        await banner_Col.create(req).then(()=> {
            ctx.status = 200
            ctx.body = {
                data: {
                    code: 200,
                    msg: 'success'
                }
            }
        })
        
    } catch (error) {
        ctx.status = 500
        ctx.body = {
            data: {
                code: 500,
                msg: error
            }
        }
    }
}

/**
 * 新增提示内容
 * @param {String} userId
 * @param {String} content
 */
const updateNotice = async (ctx,next)=> {
    var {content,userId} = ctx.request.body
    if(!content || !userId) {
        ctx.status = 401
        ctx.body = {
            data: {
                code: 401,
                msg: '缺少必填'
            }
        }
        return
    }

    try {
        await notice_Col.deleteMany({}).then(async ()=> {
            let data = {}
            data.content = content
            data.updateTime = Date.parse(new Date)
            await notice_Col.create(data).then(()=> {
                ctx.status = 200
                ctx.body = {
                    data: {
                        code: 200,
                        msg: 'success'
                    }
                }
            })
        })
    } catch (error) {
        ctx.status = 500
        ctx.body = {
            code: 500,
            msg: error
        }
    }
}


module.exports = {
    newBanner,
    updateNotice
}