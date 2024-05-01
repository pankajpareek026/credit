db.collection.aggregate([
    {
$group:{
    _id:"category",
    name:{$first:"$name"},
    total_revenue:{$sum :"price"}
}

    }
])