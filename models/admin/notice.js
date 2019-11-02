const mongoose = require('mongoose')

var Schema = mongoose.Schema
var noticeSchema = new Schema({
    content:String,
    lastUpdateTime:String,
},{ collection: 'notice', versionKey: false})

module.exports = mongoose.model('notice',noticeSchema)