const mongoose = require('mongoose')

var Schema = mongoose.Schema
var goodsSchema = new Schema({
    goodsId:{
        type:String
    },
    price:{ // 价格
        type:String
    },
    goodsName:{  // 名称
        type:String
    },
    info:{ // 简介
        type:String
    },
    cover:{ // 封面图
        type:String
    },
    banner:{ // banner
        type:Array
    },
    richCover:{ // 富文本图片
        type:Array
    },
    tags:{ // 标签
        type:String // 0:全部 
    },
    saleNum:{ // 销售量
        type:String
    },
    virtualNum:{ // 虚拟销量
        type:String
    },
    keyWords:{ // 关键字
        type:String
    },
    status:{ // 商品状态
        type:Boolean // false=>下架, true=>上架
    },
    stock:{ // 库存
        type:String
    },
    brand:{ // 品牌
        type:String
    },
    noteNumber:{ // 留言数量
        type:Number
    },
    sort:{ // 排序
        type:Number
    }
},{ collection: 'goods', versionKey: false })

module.exports = mongoose.model('goods',goodsSchema)