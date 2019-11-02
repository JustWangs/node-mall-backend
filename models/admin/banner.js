const mongoose = require('mongoose')

var Schema = mongoose.Schema
var bannerSchema = new Schema({
    id:String,
    url:String,
    goodsId:String,
    createTime:String
},{ collection: 'banner', versionKey: false})

module.exports = mongoose.model('banner',bannerSchema)