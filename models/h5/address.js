const mongoose = require('mongoose')

var Schema = mongoose.Schema
var addressSchema = new Schema({
    userId:{
        type:String,
        required:true
    },
    id:{
        type:String,
    },
    name:{
        type:String,
        required:true
    },
    tel:{
        type:String,
        required:true
    },
    province:{
        type:String
    },
    city:{
        type:String
    },
    county:{
        type:String
    },
    addressDetail:{
        type:String
    },
    areaCode:{
        type:String
    },
    postalCode:{
        type:String
    },
    address:{
        type:String
    },
    isDefault:{
        type:Boolean
    }
},{ collection: 'address', versionKey: false})

module.exports = mongoose.model('address',addressSchema)