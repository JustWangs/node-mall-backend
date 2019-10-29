const user_Col = require('../../models/h5/user')
const psw_Col = require('../../models/h5/password')
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

module.exports = {
    regist,
    getCodeImg,
    login,
    changeUserAvatar
}