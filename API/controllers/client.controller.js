const { default: mongoose } = require("mongoose");
const clients = require("../Models/client.modal");
const ApiError = require("../utils/apiError.utils");
const ApiResponse = require("../utils/apiResponse.utils");

// add new client
const newClient = async (req, res, next) => {
    try {
        // Extract necessary data from the request
        const parentId = req.body.user._id; // Get the parent user's ID
        const name = req.body.name; // Get the name of the new client

        // Check if required fields are provided
        if (!parentId || !name) {
            return next(new ApiError(401, "all fields are required"))
        }

        // Check if the client name exceeds the maximum length
        if (name.length > 15) {
            return next(new ApiError(413, "Name is too long. Maximum 15 characters allowed ."))
        }

        // Create a new client with provided data
        const result = await clients.create({ parentId, name });

        // Check if the client was successfully added to the database
        if (result.id) {
            // If the client was added successfully, send a success response
            return res.status(200).json(new ApiResponse(true, false, `'${name}' added successfully !`));

        }

        // If adding the client failed for some reason, send an error response
        return next(new ApiError(402, "Something went wrong while adding the client."))


    } catch (error) {
        // if any error accur during adding
        console.error("Error at /addClient", error.message);
        return next(new ApiError(500, 'Internal server error occurred while adding the client.'))
    }
}


// edit client name 
const editClient = async (req, res, next) => {
    try {
        const { clientId, newName, currentName } = req.body
        const { _id: parentId } = req.body.user


        if (!currentName || !clientId || !newName) {
            return next(new ApiError(400, "All fields are required"))

        }



        // find user and update name 
        const result = await clients.findOneAndUpdate(
            {
                $and: [
                    { parentId: parentId },
                    { _id: mongoose.Types.ObjectId(clientId) }]
            }, { name: newName }
        )
        console.log(result)
        // console.log("DB result =>", result)
        res.status(200).json(new ApiResponse(true, false, `'${currentName}' updated successfully.`))


    } catch (error) {
        console.log(error.message)
        return next(new ApiError(500, error.message))
    }

}

// get all clients associated with user
const allClients = async (req, res, next) => {
    try {
        console.log("body =>", req.body)
        const { _id: parentId } = req.body.user
        console.log("parenID:=>", parentId)
        if (parentId) {
            let result = await clients.aggregate(
                [
                    {
                        $match: {
                            parentId,
                        },
                    },
                    {
                        $lookup: {
                            from: "transactions",
                            localField: "_id",
                            foreignField: "clientId",
                            as: "tDetails",
                        },
                    },
                    {
                        $unwind: {
                            path: "$tDetails",
                            preserveNullAndEmptyArrays: true,
                        },
                    },
                    {
                        $group: {
                            _id: "$_id",
                            doc: {
                                $first: "$$ROOT",
                            },
                            // Keep the original document
                            balance: {
                                $sum: "$tDetails.amount",
                            },
                            lastDate: {
                                $last: "$tDetails.date",
                            },
                        },
                    },
                    {
                        $project: {
                            _id: "$doc._id",
                            name: "$doc.name",
                            balance: 1,
                            lastDate: {
                                $ifNull: ["$lastDate", "$$NOW"], // If lastDate is null (no transactions found), set to current date
                            },
                        },
                    },
                    {//sort in ascending order by balance
                        $sort: { "balance": 1 }
                    },
                ]


            );
            // console.log("result =>", result)

            if (result) { return res.json(new ApiResponse(true, false, "success", result)) }

            // return res.json({ type: 'successs', messsage: "Not Found !" })
            return res.json(new ApiResponse(true, false, "Not Found !",))

        }
        else {
            return next(new ApiError(401, "Unautherised user"))
        }
    } catch (error) {
        return next(new ApiError(500, error.message));
    }
}
// delete client
const deleteClient = async (req, res, next) => {
    try {
        const { _id: parentId } = req.body.user
        const { clientid: clientId, clientname } = req.headers
        console.log("header=>", req.headers)


        // if clientId or parentId not in request
        if (!clientId || !parentId) {
            console.log("missing client")

            return res.json(new ApiError(500, "Internal Server Error"));
        }


        // delete client from the database
        const deleteResult = await clients.deleteOne(

            { parentId, _id: mongoose.Types.ObjectId(clientId) }

        )


        // if client deleted successfully
        if (deleteResult.deletedCount >= 1) {
            return res.json(new ApiResponse(true, false, `'${clientname}' deleted successfully`))

        }

        // if client not deleted
        return next(new ApiError())
    }

    catch (error) {
        console.log("ERROR=>>>", error.message)
        return next(new ApiError(500, error.message))

    }
}

// search cliet 
const searchClient = async (req, res, next) => {
    try {
        // parse credentials from request headers and body
        const parentId = req.body.user._id
        const query = req.headers.query // client name in which you have to find from database


        // aggerigation to search user and calculate balance
        let result = await clients.aggregate(
            [
                {
                    "$match": {
                        "parentId": parentId,
                        "name": { "$regex": query, "$options": "i" } // Case-insensitive regex match for "raju"
                    }
                },
                {
                    "$lookup": {
                        "from": "transactions",
                        "localField": "_id",
                        "foreignField": "clientId",
                        "as": "trns"
                    }
                },
                {
                    "$unwind": {
                        "path": "$trns",
                        "preserveNullAndEmptyArrays": true // Changed to true for optimization
                    }
                },
                {
                    "$group": {
                        "_id": "$_id",
                        "parentId": { "$first": "$parentId" },
                        "client": { "$first": "$$ROOT" },
                        "balance": { "$sum": "$trns.amount" },
                        "lastDate": { "$last": "$trns.date" }
                    }
                },
                {
                    "$project": {
                        "name": "$client.name",
                        "parentId": 1,
                        "balance": 1,
                        "lastDate": {
                            "$ifNull": ["$lastDate", "$$NOW"]
                        }
                    }
                }
            ]

        )
        console.log("result : " + result)
        //  if client found
        if (result.length > 0) {
            // return result with success message
            return res.status(200).json(
                new ApiResponse(true, false, "success", result)
            );
        }

        // return response if client not found 
        return res.status(200).json(new ApiResponse(true, false, "Not Found !"))

    } catch (error) {
        // if any error
        return next(new ApiError(500, error.message));
    }
}







module.exports = {
    newClient,
    editClient,
    searchClient,
    allClients,
    deleteClient
}