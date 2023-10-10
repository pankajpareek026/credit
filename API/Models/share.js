const mongoose = require('mongoose')
const shareSchema = mongoose.Schema({
    parentId: {
        type: String,
        required: [true, 'parentID is Required !']
    },
    clientId: {
        type: String,
        required: [true, 'clientID is Required !']
    }
    , shareToken: {
        type: String,
        required: [true, 'share Token is Required !']
    },
    expireTime: {
        type: String,
        required: true
    }

})

module.exports = mongoose.model('share', shareSchema)