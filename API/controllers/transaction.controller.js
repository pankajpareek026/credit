const { default: mongoose } = require("mongoose");
const clients = require("../Models/client.modal");
const ApiError = require("../utils/apiError.utils");
const ApiResponse = require("../utils/apiResponse.utils");
const Transaction = require("../Models/transaction.modal");

// to add new transaction to the database in refrence of client
const newTransaction = async (req, res, next) => {
    try {
        // Extracting  data from request
        const parentId = req.body.user._id; // Assuming user ID is stored in _id field
        const { clientid: clientId } = req.headers;

        let { amount, date, dis, type } = req.body;
        console.log(req.body);
        // Check if all required fields are present, return warning if any is missing
        const messages = [];

        !amount && messages.push("Amount is required");
        !date && messages.push("Date is required");
        !dis && messages.push("Description is required");
        !type && messages.push("Type is required");
        (type === "IN" && amount < 0) && messages.push("Amout should be greater than 0")

        // if any of field is missing
        if (messages.length > 0) {
            return next(new ApiError(402, messages.join(" , ")));
        }
        if (type === "OUT" && amount > 0) {
            // to change amout for out transaction
            amount = parseFloat(amount) * -1
        }
        // If all fields are present, proceed to update client's transactions
        try {
            const result = await Transaction.create({
                clientId,
                parentId,
                amount: parseFloat(amount),
                date,
                dis,
                type
            })

            console.log("add transaction result=>", result)

            // If transaction is successfully added, send success response
            if (result._id) {
                return res.status(201).json(
                    new ApiResponse(true, false, 'Transaction saved!')
                );
            }

            // return error if any error accure during transaction seving time
            return next(new ApiError(500, "error  while transaction seving"))


        } catch (error) {

            return next(new ApiError(500, error.message));
        }

    } catch (error) {
        return next(new ApiError(500, error.message))
    }

}

// to get detail of single transaction using transaction _id
const transactionDetails = async (req, res, next) => {
    try {

        // console.log("Transaction=>", req.headers);
        const { tId } = req.params;
        const transactionDetail = await Transaction.findOne({ _id: tId }).select('-clientId -parentId -createdAt -updatedAt -__v')

        // if transaction found
        if (transactionDetail.length > 0) {
            return res.status(200).json(
                new ApiResponse(true, true, "success", transactionDetail)
            )
        }

        // if transaction not found
        return res.status(200).json(
            new ApiResponse(true, true, "Not found", transactionDetail)
        )




    } catch (error) {
        console.error("getTransactionDetail Error=>", error.message);
        res.json({
            type: 'error',
            message: "internal server error",
            isSuccess: false,
            isError: true
        })
    }
}

// to edit  transaction
const editTransaction = async (req, res, next) => {
    console.log("edit transaction")
    try {
        const { clientid } = req.headers
        let { amount, date, dis, type, tId } = req.body
        const messages = [];


        !amount && messages.push("Amount is required");
        !date && messages.push("Date is required");
        !dis && messages.push("Description is required");
        !type && messages.push("Type is required");
        (type === "IN" && amount < 0) && messages.push("Amout should be greater than 0")
        console.log("request=>", req.body)
        // if any of field is missing
        if (messages.length > 0) {
            return next(new ApiError(402, messages.join(" , ")));
        }
        if (type === "OUT" && amount > 0) {
            // to change amout for out transaction
            amount = parseFloat(amount) * -1
            console.log("amount >", amount)
        }

        const result = await Transaction.updateOne({ _id: tId, clientId: clientid }, {
            $set: {
                amount: parseFloat(amount),
                date,
                type,
                dis
            }
        })

        // if transaction updated successfully
        if (result.modifiedCount > 0) {
            return res.status(200).json(
                new ApiResponse(true, false, "updated successfully")
            )
        }
        // return error if any error accured during editing process
        return next(new ApiError(500, "something went wrong"))
        // console.log("result: ", result)

    } catch (error) {
        console.log("client/editTransaction error =>", error.message);

        return next(new ApiError(500, error.message))
    }
}
// search transaction associated with given client id

const searchTransaction = async (req, res, next) => {
    try {
        const { clientid: clientId } = req.headers;
        const { _id: parentId } = req.body.user;
        let query = req.headers.query;

        // Convert the query to a number
        const numericQuery = parseFloat(query);
        console.log("num q=>", numericQuery)
        console.log("clientId =>", clientId);
        console.log("query =>", query);
        console.log({ clientId: clientId, parentId, query });




        const result = await Transaction.aggregate(
            [
                {
                    $match: {
                        $and: [
                            { clientId: mongoose.Types.ObjectId(clientId) },
                            { parentId: mongoose.Types.ObjectId(parentId) },
                            {
                                $or: [
                                    { amount: query },
                                    { dis: query },
                                    { amount: { $regex: `${query}`, $options: 'i' } },
                                    { dis: { $regex: `${query}`, $options: 'i' } },
                                    { amount: -query },
                                    { dis: -query },
                                    { amount: { $regex: `${query}`, $options: 'i' } },
                                    { dis: { $regex: `${query}`, $options: 'i' } }
                                ]
                            }
                        ]
                    }
                }
            ]

        );
        console.log("Result: " + result);


        // if transaction found 
        if (result.length > 0) {
            return res.json({
                type: "success",
                isSuccess: true,
                isError: false,
                responseData: result,


            })
        }

        // Respond with search result or appropriate message
        return res.status(200).json({
            type: "success",
            isSuccess: true,
            isError: false,
            message: "transaction not found"

        })
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({
            isSuccess: false,
            isError: true,
            type: "error",
            message: "An error occurred while processing the search."
        });
    }
}
// to display all transaction associated with the client
const allTransactions = async (req, res, next) => {
    try {
        const clientId = req.headers.clientid
        const parentId = req.body.user._id;
        console.log("parent Id =>>", parentId)
        console.log("client Id =>>", clientId)
        if (!clientId || !parentId) {
            return next(new ApiError(401, "Invalid user"))
        }

        // 
        const result = await clients.aggregate(
            [
                {
                    $match: {
                        $and: [
                            { parentId },
                            { _id: mongoose.Types.ObjectId(clientId) }
                        ]
                    }
                },
                {
                    $lookup: {
                        from: "transactions",
                        localField: "_id",
                        foreignField: "clientId",
                        as: "tDetails"
                    }
                },
                {
                    $unwind: {
                        path: "$tDetails",
                        preserveNullAndEmptyArrays: true // Preserve documents if no matching documents are found in transactions
                    }
                },
                {
                    $sort: {
                        "tDetails.date": 1 // Sort transactions by date in ascending order
                    }
                },
                {
                    $group: {
                        _id: "$_id",
                        doc: { $first: "$$ROOT" },
                        trns: { $push: "$tDetails" },
                        balance: { $sum: { $ifNull: ["$tDetails.amount", 0] } } // Use $ifNull to handle cases where there are no transactions
                    }
                },
                {
                    $project: {
                        _id: 0,
                        name: "$doc.name",
                        balance: 1,
                        trns: {
                            $map: {
                                input: "$trns",
                                as: "trans",
                                in: {
                                    amount: "$$trans.amount",
                                    tId: "$$trans._id",
                                    date: "$$trans.date",
                                    dis: "$$trans.dis",
                                    type: "$$trans.type"
                                }
                            }
                        }
                    }
                }
            ]


        )
        console.log("result: " + result)
        // return next(new ApiResponse(true, false, "success", result[0]))
        return res.status(200).json(
            new ApiResponse(true, false, "success", result[0])
        )

    } catch (error) {
        console.log("error: " + error)
        return next(new ApiError(500, error.message))
    }
}

module.exports = {
    newTransaction,
    editTransaction,
    transactionDetails,
    searchTransaction,
    allTransactions
}