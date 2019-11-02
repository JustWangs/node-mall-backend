const goods_Col = require('./../../models/h5/goods')


/**
 * 获取商品
 * @param {String} tags 
 */
const getGoodsByTags = async (ctx,next)=> {
    var {tags=''} = ctx.request.body
    try {
        if(!tags) { // 获取全部
            await goods_Col.find({status:true},{_id:0,banner:0,richCover:0}).then(res=> {
                ctx.status = 200
                ctx.body = {
                    data: {
                        code: 200,
                        goodsList: res
                    }
                }
            })

        }else { // 根据tags
            
            await goods_Col.find({status:true, tags:tags},{_id:0,banner:0,richCover:0}).then(res=> {
                ctx.status = 200
                ctx.body = {
                    data: {
                        code: 200,
                        goodsList: res
                    }
                }
            })

        }
    } catch (error) {
        ctx.status = 500
        ctx.body = {
            data: {
                code: 500,
                msg:error
            }
        }
    }
}

/**
 * 获取所有商品的tags
 */
const getALlTags = async (ctx,next)=> {
    await goods_Col.find({},{tags:1,_id:0}).then(res=> {
        var arr = []
        res.map(x=> {
            if(arr.indexOf(x.tags)<0) {
                arr.push(x.tags)
            }
        })
        ctx.status = 200
        ctx.body = {
            data: {
                code: 200,
                list: arr
            }
        }
    })
}

/**
 * 商品详情
 * @param {String} goodsId
 */
const goodsDetail = async (ctx,next)=> {
    var { goodsId } = ctx.request.body
    if( !goodsId ) {
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
        await goods_Col.findOne({goodsId:goodsId},{_id:0}).then(res=> {
            ctx.status = 200
            ctx.body = {
                data: {
                    code: 200,
                    info:res
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

module.exports= {
    getALlTags,
    getGoodsByTags,
    goodsDetail
}