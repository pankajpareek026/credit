const clients = require("../Models/client.modal");
const moment = require("moment")
const ApiError = require("../utils/apiError.utils");
const ApiResponse = require("../utils/apiResponse.utils");
const jwtGenetator = require("../utils/jwtGenerator");
const share = require("../Models/share.modal");
const jwtVerify = require("../utils/jwtVerify");
const user = require("../Models/user.modal");
const { default: mongoose } = require("mongoose");



// to generate share  token  which will be used to get all transaction between client and user 
const GenetateShareLink = async (req, res, next) => {
    try {
        const { value, unit } = req.params;
        const newTime = moment().add(value, unit).format('lll');
        const expireTimeMili = moment(newTime).valueOf(); // expire time in milliseconds
        const expireTime = value + " " + unit // expire time in milliseconds



        const { clientId } = req.body;
        const parentId = req.body.user._id;

        // Check if any of the fields are empty
        if (!clientId || !parentId) {
            return res.status(400).json({
                type: 'error',
                message: 'something went wrong !'
            });
        }

        // Check if link already exists with given parentId and clientId, and not expired
        const linkAlreadyExists = await share.findOne({
            parentId,
            clientId,
            expireTime: { $gt: Date.now() }
        });

        if (linkAlreadyExists) {
            const linkValidity = moment(parseInt(linkAlreadyExists.expireTime)).local().format("llll");
            const message = `Already have a link Share this with your client. This link will expires on [ ${linkValidity} ]`
            const link = `https://creditc.vercel.app/share/${linkAlreadyExists._id}`
            return res.status(200).json(
                new ApiResponse(true, false, message, { link: link })
            );
        }

        // Get client name
        const client = await clients.findOne({ parentId, _id: clientId });
        const clientName = client ? client.name : "Unknown Client";

        // Generate share token
        const shareToken = await jwtGenetator({ Tn: expireTimeMili + parentId }, expireTime);

        // Create new share entry
        const result = await share.create({ clientId, shareToken, parentId, expireTime: expireTimeMili, clientName });

        // return res.json({
        //     isSuccess: true,
        //     type: 'success',
        //     isError: false,
        //     "message": `Share this link with your friend. This link will expire after ${newTime}`,
        //     "link": `https://creditc.vercel.app/share/${result._id}`
        // });
        const message = `Share this link with your friend. This link will expire after ${newTime}`
        const link = `https://creditc.vercel.app/share/${result._id}`
        return res.status(200).json(
            new ApiResponse(true, false, message, { link: link })
        );
    } catch (error) {
        console.error("Error:", error);
        // return res.status(500).json({
        //     isSuccess: false,
        //     isError: true,
        //     type: 'error',
        //     message: 'Something went wrong!'
        // });
        return next(new ApiError(500, error.message));
    }
}

// to display all transaction between client and user by share token
const getTransactionByShareToken = async (req, res, next) => {
    try {
        // Extract the share request ID from request headers
        const shareRequestId = req.headers.sharetoken;

        // Check if the share request ID exists and is valid
        if (!shareRequestId || shareRequestId.length <= 9) {
            return next(new ApiError(400, "Invalid link"))
        }

        // Find the share request in the database using the ID
        const shareIdResult = await share.find({ _id: shareRequestId });

        // If the share token exists
        if (shareIdResult.length > 0) {
            const { parentId, clientId, shareToken } = shareIdResult[0];

            // console.log("share result=>>", shareIdResult);

            const tokenStatus = await jwtVerify(shareToken);

            console.log(" JWT token status=>>", tokenStatus);
            console.log("token Status=>>", tokenStatus);
            // Check if the JWT token is expired
            if (tokenStatus.isExpired) {
                return next(new ApiError(402, "Expired Link"))
            }

            // Get parent data
            const parentData = await user.find({ _id: parentId });
            const parentName = parentData[0].name;

            // Aggregate transaction data to calculate total received, total sent, and transactions, also client name
            const result = await clients.aggregate(
                [
                    {
                        $match: {
                            parentId: parentId,
                            _id: mongoose.Types.ObjectId(clientId),
                        }
                    },
                    {
                        $lookup: {
                            from: "transactions",
                            localField: "_id",
                            foreignField: "clientId",
                            as: "trnsData"
                        }
                    },
                    {
                        $unwind: "$trnsData"
                    },
                    {
                        $sort: {
                            "trnsData.date": -1 // Sort transactions by date in descending order
                        }
                    },
                    {
                        $group: {
                            _id: "$_id",
                            clientName: { $first: "$name" },
                            totalRecived: { //total amount recived by parent
                                $sum: {
                                    $cond: {
                                        if: { $eq: ["$trnsData.type", "IN"] },
                                        then: "$trnsData.amount",
                                        else: 0
                                    }
                                }
                            },
                            totalSent: { // total amount sent by parent
                                $sum: {
                                    $cond: {
                                        if: { $eq: ["$trnsData.type", "OUT"] },
                                        then: { $multiply: ["$trnsData.amount", -1] },
                                        else: 0
                                    }
                                }
                            },
                            transactions: {
                                $push: {
                                    $cond: {
                                        if: { $eq: ["$trnsData.type", "IN"] },
                                        then: {
                                            "type": "sent",
                                            "amount": { $multiply: ["$trnsData.amount", -1] },
                                            "dis": "$trnsData.dis",
                                            "date": "$trnsData.date"
                                        },
                                        else: {
                                            "type": "recived",
                                            "amount": { $multiply: ["$trnsData.amount", -1] },
                                            "dis": "$trnsData.dis"
                                        }
                                    }
                                }
                            }
                        }
                    },
                    {
                        $project: {
                            clientName: 1,
                            _id: 0,
                            totalSent: 1,
                            totalRecived: 1,
                            balance: { $subtract: ["$totalSent", "$totalRecived"] },
                            transactions: 1,
                        }
                    }
                ]
            );

            const { clientName, totalRecived, totalSent, balance, transactions } = result[0]
            return res.status(200).json(new ApiResponse(true, false, "success", {
                parentName,
                clientName,
                totalRecived,
                totalSent,
                balance,
                transactions
            }));
        }

        // if share token not found in database
        return next(new ApiError(404, 'Invalid Link'));

    } catch (error) {
        return next(new ApiError(500, error.message));
    }
}

// to delete share token or expire link
const deleteShareToken = async (req, res, next) => {
    try {
        const { shareid } = req.headers
        //*********** */ to find out that provided id is valid object Id or not********
        const isObjectId = mongoose.isValidObjectId(shareid)

        // ***************** if  not a valid object id **********************
        if (!isObjectId) {

            return next(new ApiError(502, "Bad request !"));
        }
        // *********  valid object id ******

        //**********  find the record in database by provided id  ************
        const result = await share.findOne({ _id: shareid });

        // ******** if record  not not found 
        if (result == null) {
            return next(new ApiError(502, 'Invalid request'))
        }

        // check if link exists in database
        if (result.id === shareid) {
            // delete record from database
            const deleteResult = await share.deleteOne({ _id: shareid })

            // if record deleted successfully 
            if (deleteResult.deletedCount == 1) {
                return res.status(200).json(
                    new ApiResponse(true, false, "Link deleted successfully")
                )

            }
            // if record is not deleted or any error at database

            return next(new ApiError(401, "something went wrong"))


        }
    }
    catch (error) {
        return next(new ApiError(500, error.message));
    }
}



module.exports = {
    GenetateShareLink,
    getTransactionByShareToken,
    deleteShareToken
}