const mongoose = require('mongoose')
const clientsSchema = new mongoose.Schema({
    parentId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        require: true,
        maxLength: [15, 'name must not be more than 15 charachers !']
    },
}, {
    timestamps: true,
})

module.exports = mongoose.model('clients', clientsSchema)