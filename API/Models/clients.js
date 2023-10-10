const mongoose=require('mongoose')
const clientsSchema=mongoose.Schema({
    parentId:{
        type:String,
        require:true
    },
    name: {
        type: String,
        require: true
    },
    transactions:[]
})

module.exports =mongoose.model('clients',clientsSchema)