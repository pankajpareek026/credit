const mongoose = require('mongoose')
const userSchema = mongoose.Schema({
    name:{
        type:String,
        default:null
    },
    email:{
        type:String,
        unique: true
    },
    pass: String,
    //jwt token
    token:{
        type:String,
        default:null
    }
})
module.exports = mongoose.model('credit-users', userSchema)