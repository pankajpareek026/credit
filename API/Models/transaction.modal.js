const mongoose = require('mongoose');
const transactionSchema = new mongoose.Schema({

    /**
     * 
amount
15000
date
"2024-01-14T20:20"
dis
"CASH"
type
"IN"
     */
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "client"
    },
    parentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    amount: {
        type: Number,
        require: [true, "Amount is required"]
    },
    date: {
        type: Date,
        required: [true, "Date is required"]
    },
    dis: {
        type: String,
        required: [true, "Discription is required"]
    },
    type: {
        type: String,
        required: [true, "Transaction is required"]
    }
}, {
    timestamps: true
})

const Transaction = mongoose.model("Transaction", transactionSchema)
module.exports = Transaction