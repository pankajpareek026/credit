const mongoose=require('mongoose')
const clientsSchema=mongoose.Schema({
    parentId:String,
    name:String,
    transactions:[]
})

module.exports =mongoose.model('clients',clientsSchema)