const mongoose = require('mongoose')
const shareSchema = new mongoose.Schema({
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
     clientName: {
    type: String,
    required: [true, 'client Name is Required !']
},
    expireTime: {
    type: String,
    required: true
}

})

module.exports = mongoose.model('share', shareSchema)