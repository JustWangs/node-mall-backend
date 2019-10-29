const user_Col = require('../../models/h5/user')
const add_Col = require('../../models/h5/address')
const uuid = require('uuid')
/**
 * 新增地址
 */
const createAddress = async (ctx,next)=> {
    var address = ctx.request.body
    address.id = uuid.v1()
    if(!address.userId || !address.tel || !address.areaCode || !address.name) {
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
        var user = await user_Col.findOne({userId:address.userId})
        if(!user) {
            ctx.status = 401
            ctx.body = {
                data: {
                    code: 401,
                    msg: '用户不存在'
                }
            }
            return
        }
        // 获取该用户的所有地址
        var userAddresses = await add_Col.find({userId:address.userId})

        // 判断有没有默认地址
        var hasDefaultAdd = false
        if(userAddresses) {
            userAddresses.map(x=> {
                if(x.isDefault) {
                    hasDefaultAdd = true
                }
            })
        }

        if(address.isDefault) { // 用户设置默认地址
            if(hasDefaultAdd) { //有默认地址
                await add_Col.update({userId:address.userId,isDefault:true},{isDefault:false}).then(async res=> {
                    await add_Col.create(address)
                    ctx.body = {
                        data: {
                            code: 200,
                            addressList:await returnAllAddress(address.userId),
                            msg: 'success'
                        }
                    }
                })
            }else { // 没有默认地址
                await add_Col.create(address)
                ctx.body = {
                    data: {
                        code: 200,
                        addressList:await returnAllAddress(address.userId),
                        msg: 'success'
                    }
                }
            }
            return
        }

        await add_Col.create(address)
        ctx.body = {
            data: {
                code: 200,
                addressList:await returnAllAddress(address.userId),
                msg: 'success'
            }
        }

    } catch (error) {
        ctx.status = 500
        ctx.body = {
            data: {
                code: 500,
                msg: '新增失败'
            }
        }
    }
}

/**
 * 获取用户所有地址
 * @param {String} userId
 */
const userAddress = async (ctx,next)=> {
    var {userId} = ctx.request.body
    if(!userId) {
        ctx.status = 401
        ctx.body = {
            data: {
                code: 401,
                msg: '缺少必填项'
            }
        }
        return
    }
    ctx.status = 200 
    ctx.body = {
        data: {
            code: 200,
            msg: 'success',
            addressList: await returnAllAddress(userId)
        }
    }
}

/**
 * 返回用户所有的地址
 * @param {String} userId
 */
const returnAllAddress = async (userId)=> {
    let addressList = await add_Col.find({userId:userId},{_id:0})
    return addressList
    
}

module.exports = {
    userAddress,
    createAddress
}