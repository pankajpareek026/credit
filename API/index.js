//moduls
const Pkey = process.env.jwt_key
const cors = require('cors')
const bcrypt = require('bcryptjs')
const express = require('express')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')
require('./db/config.js')
const app = express()
const user = require('./Models/user.js');
const clients = require('./Models/clients')
const share = require('./Models/share.js')
const jwtGenetator = require('./utils/jwtGenerator.js')
const jwtVerify = require('./utils/jwtVerify.js')

//meddilswares

const privetKey = "WeShoulHaveAStrongPriVaTeKek@24-12-2022"
let i = 0
app.use(express.json())
app.use(cookieParser());

// app.use(cors({
//     origin: 'http://localhost:3000', // Adjust the origin to match your React app's URL
//     credentials: true
// }))
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Accept,token,clietnId,clientName,uid');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
})
//
const port = process.env.port || 2205

async function authy(req, res, next) {
    try {
        var origin = req.get('origin');
        console.log("origin=>>", origin)
        const token = req.headers.token;
        
        // Check if token is missing or undefined
        if (!token || token === "undefined") {
            // Respond with session expired error
            return res.status(401).json({ message: "Session expired", type: "error" });
        }

        // Verify JWT token
        jwt.verify(token, privetKey, (err, decodedToken) => {
            // If error occurs during token verification
            if (err) {
                // Handle invalid signature error
                if (err.message === 'invalid signature') {
                    return res.status(401).json({ type: 'error', message: 'Unauthorized user access!' });
                }
                // Handle other errors during token verification
                return res.status(500).json({ type: 'error', message: err.message });
            } else {
                // If token is valid, attach decoded user information to request body
                req.body.user = decodedToken;
                // Proceed to the next middleware or route handler
                next();
            }
        });
    } catch (error) {
        // Handle internal server error
        res.status(500).json({ type: 'error', message: 'Internal server error!' });
    }
}


// register route
// Endpoint for user registration
app.post('/register', async (req, res) => {
    try {
        // Extracting name, email, and password from request body
        const { name, email, pass } = req.body;

        // Checking if any required field is missing
        if (!name || !email || !pass) {
            res.status(402).json({
                type: 'warning',
                message: "All fields are required"
            });
        } else {
            // Check if user already exists
            const userExist = await user.findOne({ email });
            if (userExist) {
                res.send({
                    type: 'warning',
                    message: "User Already Exists"
                });
            } else {
                // Encrypting password
                const enPass = await bcrypt.hash(pass, 10);

                // Saving user data in database
                let query = await user.create({ name, email, pass: enPass });
                query = await query.toObject();

                // Removing sensitive data before sending response
                delete query.pass;
                delete query.email;

                // Generate JWT token for authentication
                const token = await jwtGenetator(query, privetKey);

                // Configuring JWT token options
                const options = {
                    expiresIn: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                    httpOnly: true
                };

                // Sending JWT token as a cookie along with registration success message
                res.status(200).cookie("tkn", token, options).json({
                    'type': 'success',
                    message: 'Registration successful!'
                });
            }
        }
    } catch (error) {
        // Handling errors
        console.log(error);
        let errorMessage = error.message;

        // Parsing and formatting error messages
        errorMessage = errorMessage.replaceAll('credit-users validation failed:', '');
        errorMessage = errorMessage.replace(' name: ', '');
        errorMessage = errorMessage.replace(' email: ', '');
        errorMessage = errorMessage.replace(' pass: ', '');

        // Sending error message as response
        res.json({
            type: 'error',
            message: errorMessage
        });
    }
});

// login
app.post('/login', async (req, res) => {
    try {
        const { email, pass } = req.body
        if (!email || !pass) {
            return res.status(402).json({ result: "All fiels are Requires" });
        }

        // find is user exists
        let result = await user.findOne({ email: email })
        if (result) {
            //validate password
            const status = await bcrypt.compare(pass, result.pass)
            //if password valid 
            if (status) {
                result = await result.toObject()
                // delete result.name
                delete result.pass
                delete result.email
                delete result.__v

                const token = await jwt.sign(result, privetKey, {
                    expiresIn: "28d"
                })

                //  
                const options = {
                    expiresIn: new Date(Date.now() + 29 * 24 * 60 * 60 * 60 * 1000),
                    httpOnly: true
                }

                return res.cookie("user", token, options).json(
                    {
                        type: "success", messsage: "Loggedin successfully 👍 !",
                        user: token
                    }
                )

                // res.send('login successfully !')
            }
            //invalid password
            else {

                return res.status(402).json({
                    type: "error",
                    message: "Invalid Password !"
                })
            }
        }

        if (!result) {
            return res.status(402).json({
                type: 'error',
                message: "User Does Not Exist"
            })
        }


    } catch (error) {
        return res.json({
            type: 'error',
            message: 'internal server error !',
            actulaErroAtLogin: error.message
        })
    }
})

// to logout user
app.get('/logout', authy, (req, res) => {
    res.cookie.Clear("user");
})

//add clients 
// Route to add a new client
app.post('/addclient', authy, async (req, res) => {
    try {
        // Extract necessary data from the request
        const parentId = req.body.user._id; // Get the parent user's ID
        const name = req.body.name; // Get the name of the new client
       
        // Check if required fields are provided
        if (!parentId || !name) {
            // If any required field is missing, send a warning response
            return res.send({
                type: 'warning',
                message: "All fields are required !"
            });
        }

        // Check if the client name exceeds the maximum length
        if (name.length > 15) {
            // If the name is too long, send an error response
            return res.json({
                type: 'error',
                message: "Name is too long. Maximum length is 15 characters."
            });
        }

        // Create a new client with provided data
        const result = await clients.create({ parentId, name });
        
        // Check if the client was successfully added to the database
        if (result.id) {
            // If the client was added successfully, send a success response
            return res.status(200).json({
                type: "success",
                message: `'${name}' added successfully.`
            });
        }

        // If adding the client failed for some reason, send an error response
        return res.status(402).json({
            type: 'error',
            message: "Something went wrong while adding the client."
        });
    } catch (error) {
        // Handle any errors that occur during the process
        console.error("Error at /addClient", error.message);
        res.json({
            type: 'error',
            message: 'Internal server error occurred while adding the client.'
        });
    }
});

// edit client name
app.put("/editClient", authy, async (req, res) => {

    try {
        const { clientId, newName, currentName } = req.body
        const { _id: parentId } = req.body.user


        if (!currentName || !clientId || !newName) {
            return res.json({
                type: 'error',
                message: "internal Server error !",

            })
        }


        // console.log("Body =>", req.body)
        // console.log("searching user with clientId and parentId ........")

        // find user and update name 
        const result = await clients.findOneAndUpdate(
            {
                $and: [
                    { parentId: parentId },
                    { _id: mongoose.Types.ObjectId(clientId) }]
            }, { name: newName }
        )

        // console.log("DB result =>", result)
        res.json({
            type: 'success',
            message: `Name '${currentName}' to '${newName}' updated successfully !`,
        })
    } catch (error) {
        console.log(error.message)
        return res.json({
            type: 'error',
            message: "internal Server error !",

        })
    }

})


// to delete client from database 
app.delete('/deleteClient', authy, async (req, res) => {
    try {
        const { _id: parentId } = req.body.user
        const { clientid: clientId } = req.headers


        // if clientId or parentId not in request
        if (!clientId || !parentId) {
            console.log("missing client")
            return res.json({
                type: 'error',
                message: "internal Server error !",

            })
        }


        // delete client from the database
        const deleteResult = await clients.deleteOne(

            { parentId, _id: mongoose.Types.ObjectId(clientId) }

        )


        // if client deleted successfully
        if (deleteResult.deletedCount >= 1) {
            return res.json({
                type: "success",
                message: "user deleted successfully"
            })
        }



        // in case of client not deleted OR client not found
        return res.json({
            type: 'error',
            message: "something went wrong !",

        })



    }

    catch (error) {
        console.log("ERROR=>>>", error.message)
        return res.json({
            type: 'error',
            message: "internal Server error !",

        })

    }

})

// search the user from dashboard search bar

app.get('/search', authy, async (req, res) => {

    try {

        const parentId = req.body.user._id
        const query = req.headers.query

        let result = await clients.aggregate([
            { "$match": { name: { "$regex": query, $options: "i" } } },
            {
                "$project": {
                    "name": 1, "parentId": 1,
                    "totalAmount": {
                        "$sum": "$transactions.amount"
                    },
                }
            }
        ])

        if (result.length > 0) {
            res.json({
                type: 'success',
                responseData: result
            })
        }
        else {
            res.json({
                type: 'warning',
                message: "Not Found !"
            })
        }


    } catch (error) {
        res.json({
            type: 'error',
            message: 'internal server error !',
            actulaErroAtLogin: error.message
        })
    }
})

app.get('/client/search', authy, async (req, res) => {
    const clientId = req.headers.id
    let query = req.headers.query
    // query=parseInt(query)


    const result = await clients.find(
        {
            _id: clientId,
            "transactions.amount": parseFloat(query)
        }
    )

    // res.json({ type: "hitted" })
})
app.get('/clients', authy, async (req, res) => {
    const parentId = req.body.user._id
    // res.send(parentId)
    
    if (parentId) {

        let result = await clients.aggregate([
            { "$match": { parentId } },
            {
                "$project": {
                    "name": Infinity, "parentId": Infinity,
                    "totalAmount": {
                        "$sum": "$transactions.amount"
                    },
                    "lastDate": { $slice: ["$transactions.date", -1] }

                }
            }
        ]);
        // console.log("result =>", result)


        if (result) { res.json({ type: 'successs', responseData: result }) }
        else {
            res.json({ type: 'successs', messsage: "Not Found !" })
        }
    }
    else {
        res.json({
            type: 'error',
            message: "Unautherised user"
        })
    }
})
// to add new transactions in users page
app.post('/client/newTransaction', authy, async (req, res) => {
    const parentId = req.body.user._id
    const _id = req.headers.uid
   
    const { amount, date, dis, type } = req.body;
    if (!parentId || !_id || !amount || !date || !dis || !type) {

        return res.json({
            type: 'warning',
            message: "all fiels are required"
        })
    }
    else {
        const result = await clients.updateOne({ _id, parentId }, {
            "$push": {
                "transactions": {
                    "amount": parseFloat(req.body.amount),
                    "date": req.body.date,
                    "dis": req.body.dis,
                    "type": req.body.type
                }
            }
        })

        if (result.modifiedCount == 1) {
            res.json({ type: "success", message: 'transaction saved !' })

        }
        else {
            res.json({
                type: 'error',
                message: "Someting went wrong ! "
            })
        }
    }
})

// **************************************************  to fetch all transactions with a user
app.get('/client/transactions', authy, async (req, res) => {

    const _id = req.headers.uid
    const parentId = req.body.user._id;
    if (!_id || !parentId) {
        return res.json({
            type: 'error',
            message: "invalid user !"
        })
    }
    else {
        const result = await clients.find({ _id, parentId })
       
        res.json({
            type: 'success',
            responseData: result[0]
        })
    }
})

app.post('/shareRequest', authy, async (req, res) => {
    try {
        /* --- Tasks ---
        1. all fiels are required >
        2. check if link is present with given parentId and expire time is greater than presentTime
        3. if link is present then send respose with existing link
        4. otherwise generate new link and send type
        5.
        */
        
        const { clientId } = req.body;

        const parentId = req.body.user._id;
        const currentTime = Date.now()
        const expireTime = Date.now() + 1 * 24 * 60 * 60 * 1000
        //  ------- check if any of field is empty   -------------
        if (!clientId || !clientId) {
            res.json({
                type: 'error',
                message: 'All Fields Are Required !',

            })
            return;
        }
        const linkAlReadyExists = await share.findOne(
            {
                $expr: {
                    $and: [
                        { parentId }, { clientId }, { $gt: ['$expireTime', currentTime] }
                    ]
                }
            })
       
        if (linkAlReadyExists != null) {
            res.json({
                "link exists": 'true',
                "message": 'share this link with your friend . this link will be invalid after 24 Hours ',
                "link": `https://creditc.vercel.app/share/${linkAlReadyExists._id}`
            })
            return
        }

        


        let clientName = await clients.find({ parentId, _id: clientId });
        clientName = clientName[0].name;

        
        const shareToken = await jwtGenetator({ Tn: expireTime + parentId })
        let result = await share.create({ clientId, shareToken, parentId, expireTime: Number(expireTime), clientName })

        // console.log(result)
        res.json({
            "message": 'share this link with your friend . this link will be invalid after 24 Hours ',
            "link": `https://creditc.vercel.app/share/${result._id}`
        })
    } catch (error) {
        res.send(
            {
                type: 'error',
                message: 'something went wrong !',

            }
        )
    }


})



/* Route : to show the data at client  */
app.get('/share', async (req, res) => {
    try {
        const shareRequestId = req.headers.sharetoken;  /* id send by user */
     
        if (!shareRequestId) {
            return res.json({
                'type': 'error',
                'message': 'invalid Link !',


            })
        }
        if (shareRequestId.length > 9) {
            const shareIdResult = await share.find({ _id: shareRequestId }) /*indicates the document id inwhich token info is seved */

            // console.log("shareID", shareIdResult)


            if (shareIdResult.length > 0) {

                const { parentId, clientId, shareToken } = shareIdResult[0] /* parse parnetId clinetId and ShareToken from the database find operation result */
                const tokenStatus = await jwtVerify(shareToken)  /* verify json tocken whick is seved in database */
                //  if JWT is expired
                if (tokenStatus === "jwt expired") {
                    res.json({
                        'type': 'error',
                        'message': 'Expired link !',


                    })
                    return
                }

                const parentData = await user.find({ _id: parentId })
                const parentName = parentData[0].name
                let clientData = await clients.find({ parentId, _id: clientId })
                const { transactions, name } = clientData[0]
                //to change the value accordind to user and calcualte some of recived and sent money
                let totalSentAmount = 0
                let totalRecivedAmount = 0
                let changedTransactinFormat = transactions.map((data) => {
                    // in==send *-1 & out =recive
                    if (data.type == 'OUT') {
                        data.type = 'recived'
                        if (data.amount != 0) { data.amount = data.amount * -1 }
                        totalRecivedAmount += data.amount
                        return data
                    }
                    else if (data.type == 'IN') {
                        data.type = 'sent'
                        if (data.amount != 0) { data.amount = data.amount * -1 }
                        totalSentAmount += data.amount
                        return data
                    }
                    console.log(data.type)
                })
                const totalRemainingAmount = totalRecivedAmount - (totalSentAmount * -1)
              
                res.json({
                    type: 'success',
                    responseData: {
                        clientName: name,
                        parentName,
                        totalRecivedAmount,
                        totalSentAmount,
                        totalRemainingAmount,
                        transactions
                    }

                })
                return

            }
            else {
                res.json({
                    'type': 'Error',
                    'message': 'invalid Link ! 1',
                    'responseData': shareIdResult

                })
                return
            }



        }
        else {
            return res.json({
                'type': 'error',
                'message': 'invalid Link !',


            })

        }
        // console.log(req)

    } catch (error) {
        res.json({
            error: 'internal server Error',
            message: error.message
        })
    }
})

app.get('/userProfile', authy, async (req, res) => {
    const currentTime = Date.now()
    // requirements
    /*
    1. username
    2. associated cliets (all clients list)
    3. all share links generated by usser

    */
    try {
        const { name, _id } = req.body.user
        console.log('req recived')
        const allClients = await clients.find({ parentId: _id }, { transactions: 0, parentId: 0 });
        let allSharedLinks = await share.find({ parentId: _id })
        allSharedLinks = allSharedLinks.map(({ shareToken, clientName, expireTime, _id }) => {
            return {
                linkId: _id,
                isActive: currentTime < expireTime,
                clientName, shareToken
            }

        })
        res.json({
            'status': 'ok',
            'name': name,
            'symbol': name.charAt(0),
            'id': _id,
            allClients,
            allSharedLinks
        })
    } catch (error) {

        res.json({
            type: 'error',
            'message': 'Internal Server Error  !'
        })
    }
})

app.delete('/deleteSharedLink', authy, async (req, res) => {
    try {
        const { shareid } = req.headers
        console.log("Headers =>>>", req.headers)
        //*********** */ to find out that provided id is valid object Id or not********
        const isObjectId = mongoose.isValidObjectId(shareid)

        // ***************** if  not a valid object id **********************
        if (!isObjectId) {
            res.status(502).json(
                {
                    type: 'error',
                    message: 'Bad requiest !'
                }

            )
            return
        }
        // *********  valid object id ******
        else {
            //**********  find the record in database by provided id  ************
            const result = await share.findOne({ _id: shareid });

            // ******** if record  not not found 
            if (result == null) {
                res.status(502).json(
                    {
                        type: 'error',
                        message: 'invalid request !'
                    }

                )
                return
            }

            // **************   record (share link) found *****
            if (result.id === shareid) {

                // delete record from database
                const deleteResult = await share.deleteOne({ _id: shareid })

                // if record deleted successfully 
                if (deleteResult.deletedCount == 1) {
                    res.json({
                        type: 'success',
                        message: 'link deleted successfully !'

                    })
                    return
                }
                // if record is not deleted or any error at database
                else {
                    res.status(500).json({
                        type: 'error',
                        message: 'something went wrong'

                    })
                    return
                }
                return
            }

        }



    }
    catch (error) {

        res.status(500).json({
            type: 'error',
            message: 'internal server error !'
        })
    }

})

// app.('/changeUserName',authy,(req,res)=>{
//    
// })
app.delete('/deleteAccount', authy, (req, res) => {

})

app.listen(port, (err) => {
    if (err) throw err;
    console.log(`app is running on http://localhost:${port}`)
})









