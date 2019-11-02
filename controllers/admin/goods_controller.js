const goods_col = require('./../../models/h5/goods')
const uuid = require('uuid')

/**
 * 新建商品
 * @param {Object} goods 
 */
const createGoods = async (ctx,next)=> {
    var {
        goodsName,
        price,
        info,
        cover,
        banner,
        richCover,
        tags,
        saleNum=0,
        virtualNum=100,
        keyWords,
        status=true,
        stock=1000,
        brand,
        noteNumber=0,
        sort
    }  = ctx.request.body
    if(!goodsName || !price || !cover || !tags || !banner) {
        ctx.status = 401
        ctx.body = {
            data: {
                code: 401,
                msg: '缺少必填项'
            }
        }   
        return
    }

    try {
        ctx.status = 200
        var goods = {
            goodsName,
            price,
            info,
            cover,
            banner:banner.split(','),
            richCover,
            tags,
            saleNum,
            virtualNum:100,
            keyWords,
            status:true,
            stock:1000,
            brand,
            noteNumber:0,
            sort
        }

        goods.goodsId = uuid.v1().replace(/-/g,'')
        await goods_col.create(goods).then(()=> {
            ctx.body = {
                data: {
                    code: 200,
                    msg: 'success'
                }
            }
        })



        
        
    } catch (error) {
        console.log(error)
        ctx.status  = 500

        ctx.body = {
            data: {
                code: 500,
                msg:error
            }
        }
    }



}

/**
 * 删除商品 （需要考虑tags表问题）
 */


module.exports = {
    createGoods,
}