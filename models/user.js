var mongoose = require('mongoose')

var Schema = mongoose.Schema

var userSchema = new Schema({
    userName: {
        type: String,
        require: true
    },
    userId: {
        type: String,
        require: true
    },
    phone: {
        type: String,
    },
    collectionGoods: {
        type: Array
    },
    avatar: {
        type: String
    }
},{ collection: 'user', versionKey: false})

module.exports = mongoose.model('user',userSchema)
