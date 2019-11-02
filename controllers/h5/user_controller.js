const user_Col = require('../../models/h5/user')
const psw_Col = require('../../models/h5/password')
const banner_Col = require('../../models/admin/banner')
const notice_Col = require('../../models/admin/notice')
const ccap = require('ccap')()
const passport = require('../../utils/passport');
const uuid = require('uuid')
const config = require('../../config')
const jwt = require('jsonwebtoken')

/**
 * 注册
 * @param {String} userName 
 * @param {String} password 
 */
const regist = async(ctx,next)=> {
    var { userName='', password='', phone=''} = ctx.request.body
    if( userName=='' || password=='' ) {
        ctx.status = 401
        ctx.body = {
            data: {
                code: 401,
                msg: '缺少必填项目'
            }
        }
        return
    }
    try {
        ctx.status = 200
        var user = await user_Col.findOne({
            userName:userName
        })
        if(user) {
            ctx.status = 401  
            ctx.body = {
                data: {
                    code: 401,
                    msg: '账号已存在'
                }
            }  
            return
        }
        // 随机生成userID
        var userId = uuid.v1()
        var newUser = await user_Col.create({
            userId: userId,
            userName: userName,
            collectionGoods: [],
            phone: phone,
            avatar: 'https://i.loli.net/2019/10/24/OA7xXHQLu51TgBk.jpg',
        })
        if(newUser) {
            // 加密
            var hash = await passport.encrypt(password, config.saltTimes)
            var result = psw_Col.create({
                password:hash,
                userId:userId
            })
            if(result){
                ctx.body = {
                    code:200,
                    msg:'注册成功',
                    data:{
                        userId:newUser.userId,
                        userName:newUser.userName
                    }
                }
                return;
            }
            ctx.status = 500
            ctx.body = {
                code:500,
                msg:'注册失败'
            }
        }


    } catch (error) {
        ctx.status = 500
        ctx.body = {
            code:500,
            msg:'注册失败'
        }
    }
}

/**
 * 获取验证码 
 */
const getCodeImg = async(ctx,next)=> {
    var ary = ccap.get()
    let code = ary[0]
    let buf = ary[1]
    ctx.body = buf
    ctx.type= 'image/png'
    ctx.session.captcha = code
}

/**
 * 登录
 * @param {String} userName
 * @param {String} password
 * @param {String} code 
 */
const login = async(ctx,next)=> {
    var {userName,password,code} = ctx.request.body
    if(!userName || !password || !code) {
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
        if(code != ctx.session.captcha) {
            ctx.status = 401
            ctx.body = {
                data: {
                    code: 401,
                    msg: '验证码错误'
                }
            }
            return
        }

        var user = await user_Col.findOne({userName:userName})
        if(!user) {
            ctx.status = 401
            ctx.body = {
                data: {
                    code: 401,
                    msg: '没有该用户'
                }
            }
            return
        }

        var userId = user.userId
        const pass = await psw_Col.findOne({
            userId
        },{
            password:1
        })
        const match = await passport.validate(password, pass.password)

        if(match) { // 密码匹配
            // 生成token
            const token = jwt.sign({
                uid:user.userId,
                name:user.userName,
                exp:config.jwt.time
            },config.jwt.secret)

            ctx.body = {
                data: {
                    Authorization:token,
                    collectionGoods:user.collectionGoods,
                    userId:user.userId,
                    userName:user.userName,
                    avatar:user.avatar,
                    phone:user.phone,
                    msg:'登录成功',
                    code:200
                }
            }

            return
        }
        ctx.status = 401
        ctx.body = {
            data: {
                msg:'账号或密码错误🙅‍',
                code:401
           }
        }
        
    } catch (error) {
        ctx.status = 500
        ctx.body = {
            code:500,
            msg:'登录失败'
        }
    }
}

/**
 * 更换用户头像
 * @param {String} newAva
 * @param {String} userId
 * @return {Boolean} 
 */
const changeUserAvatar = async(ctx,next)=> {
    var {userId,avatar} = ctx.request.body
    if(!userId || !avatar) {
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
        var user = await user_Col.update({userId:userId},{avatar:avatar})
        if(user) {
            ctx.body = {
                data: {
                    code: 200,
                    msg: '更新成功'
                }
            }
        }else {
            ctx.status = 500
            ctx.body = {
                data: {
                    code: 500,
                    msg: '出错了，请重新试一次'
                }
            }
        }
    } catch (error) {
        ctx.status = 500
        ctx.body = {
            data: {
                code: 500,
                msg: '服务器异常'
            }
        }
    }
}

/**
 * 获取banner以及通知
 * @param { String } userId
 */
const getBannerNotice = async (ctx,next)=> {
   try {
        var bannerList = await banner_Col.find({},{_id:0,id:0,createTime:0})
        var notice = await notice_Col.findOne({},{_id:0})
        ctx.status = 200
        ctx.body = {
            data: {
                code: 200,
                bannerList:bannerList,
                notice:notice.content
            }
        }
   } catch (error) {
       ctx.status = 500
       ctx.body = {
           code: 500,
           msg:error
       }
   }
}

/**
 * 添加购物车
 * @param {String} userId
 * @param {String} goodsId
 * @return {String} collectionNums
 */
const addToCollection = async (ctx,next)=> {
    var {userId, goodsId} = ctx.request.body
    if(!goodsId || !userId) {
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
        /**
         * 1. 获取所有的收藏
         * 2. 判断有没有收藏过该商品 
         *      有 => num+1
         *      没有 => 收藏 num:1
         * 3. 返回
         */

        await user_Col.findOne({userId:userId},{collectionGoods:1}).then(async res=> {
            
            ctx.status = 200

            var myColGoods = res.collectionGoods  // 我所有收藏的商品

            if(myColGoods.length>0) {
                // 判断有没有收藏过
                let collectionGoodsId = []
                var goodsNums = 0 // 如果收藏了该商品 默认该商品有一个
                myColGoods.map(x=> {
                    collectionGoodsId.push(x.goodsId)
                    if(x.goodsId == goodsId) {
                        goodsNums = x.num+1
                    }
                })
                if(collectionGoodsId.indexOf(goodsId)>=0) { // 收藏过
                    await user_Col.updateOne({
                        'collectionGoods.goodsId':goodsId,
                        userId:userId
                    },{
                        '$set':{
                            'collectionGoods.$.num':goodsNums
                        }
                    })
                    ctx.body = {
                        data: {
                            code: 200,
                            list: await user_Col.findOne({
                                userId:userId
                            },{
                                collectionGoods:1,
                                _id:0
                            })
                        }
                    }
                }else { // 没收藏过
                    let data = {
                        goodsId: goodsId,
                        num: 1
                    }
                    await user_Col.updateOne({userId:userId},{
                        $push:{
                            collectionGoods:data
                        }
                    })
                    ctx.body = {
                        data: {
                            code: 200,
                            list: await user_Col.findOne({
                                userId:userId
                            },{
                                collectionGoods:1,
                                _id:0
                            })
                        }
                    }
                }
            }else { // 没有收藏过任何商品
                let data = {
                    goodsId: goodsId,
                    num: 1
                }
                await user_Col.updateOne({userId:userId},{
                    $push:{
                        collectionGoods:data
                    }
                })
                ctx.body = {
                    data: {
                        code: 200,
                        list: await user_Col.findOne({
                            userId:userId
                        },{
                            collectionGoods:1,
                            _id:0
                        })
                    }
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
 * 删除购物车
 */
const delCollection = async (ctx,next)=> {
    var { userId, goodsId } = ctx.request.body
    if(!userId || !goodsId) {
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
        var myColGoods = await user_Col.findOne({userId:userId},{_id:0,collectionGoods:1})
        var myColGoodsId = []
        if(myColGoods.length<1) {
            ctx.status = 401
            ctx.body = {
                data: {
                    code: 401,
                    msg: '商品没有添加到购物车'
                }
            }
            return
        }
        myColGoods.collectionGoods.map(x=> {
            myColGoodsId.push(x.goodsId)
        })

        if(myColGoodsId.indexOf(goodsId)<0) {
            ctx.status = 401
            ctx.body = {
                data: {
                    code: 401,
                    msg: '商品没有添加到购物车'
                }
            }
            return
        }
        
        await user_Col.updateOne({userId:userId},{
            $pull:{
                "collectionGoods":{goodsId:goodsId}
            }
        })
        ctx.body = {
            data: {
                code: 200,
                list: await user_Col.findOne({
                    userId:userId
                },{
                    collectionGoods:1,
                    _id:0
                })
            }
        }

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




module.exports = {
    regist,
    getCodeImg,
    login,
    changeUserAvatar,
    getBannerNotice,
    addToCollection,
    delCollection
}