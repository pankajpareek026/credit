const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required !'],
        minLength: [5, 'Too short Name !'],
        maxLength: [15, 'Too long Name !'],
        trim: true,

    },
    email: {
        type: String,
        unique: true,
        required: [true, 'Email is required !']
    },
    pass: {
        type: String,
        require: [true, 'Password is required !'],
        min: [8, 'too short password !']
    },
    //jwt token
    token: {
        type: String,
        default: null
    }
})
module.exports = new mongoose.model('credit-users', userSchema)