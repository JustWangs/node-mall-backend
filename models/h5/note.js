const mongoose = require('mongoose')

var schema = mongoose.schema

var noteSchema = new schema({
    id:String,
    userId:String,
    goodsId:String,
    content:String,
    avator:String,
    createTime:String
},{ collection: 'note', versionKey: false })

module.exports = mongoose.model('note',noteSchema)
