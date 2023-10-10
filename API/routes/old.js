//moduls
const Pkey = process.env.jwt_key
const cors = require('cors')
const bcrypt = require('bcryptjs')
const express = require('express')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
require('./db/config.js')
const app = express()
const user = require('./Models/user.js');
const clients = require('./Models/clients')
//meddilswares
const privetKey = "WeShoulHaveAStrongPriVaTeKek@24-12-2022"
let i = 0
app.use(express.json())
app.use(cookieParser())
app.use(cors())
//

const port = process.env.port || 2200
const authy = async (token, KEY) => {
    return await jwt.verify(token, KEY)

}
async function authy(req, res, next) {
    if (req.headers.token) {
        const user = jwt.verify(req.headers.token, privetKey, (err, valid) => {
            if (err) {
                res.json({ response: err.message })
            }
            else {
                console.log(valid)

            }

        })
        next()
    }
    else {
        res.json({ result: "some thing went wrong !" })
    }
}
// register route
app.post('/register', async (req, res) => {

    const { name, email, pass } = req.body;

    if (!name || !email || !pass) {
        res.status(402).json({ response: "All fields are required" })
    }
    //process for registration :
    else {
        // check if use exists
        const userExist = await user.findOne({ email })
        if (userExist) {
            res.send({ response: "user Already Exists " })
        }
        else {
            //save data in DB
            const enPass = await bcrypt.hash(pass, 10)
            let query = await user.create({ name, email, pass: enPass })
            query = await query.toObject()
            delete query.pass
            delete query.email

            const token = jwt.sign(query, privetKey)
            const options = {
                expiresIn: new Date(Date.now() * 3 * 24 * 60 * 60 * 60 * 1000),
                httpOnly: true
            }
            res.status(200).cookie("tkn", token, options).json({ response: "success" })
        }
    }
})
// login
app.post('/login', async (req, res) => {
    const { email, pass } = req.body
    if (!email || !pass) {
        res.status(402).json({ result: "All fiels are Requires" });
    }
    else {
        let result = await user.findOne({ email: email })
        if (result) {
            //validate password
            const status = await bcrypt.compare(pass, result.pass)
            console.log(status)
            //if password valid 
            if (status) {
                result = await result.toObject()
                // delete result.name
                delete result.pass
                delete result.email;
                console.log(result);
                const token = jwt.sign(result, privetKey, {
                    expiresIn: "2d"
                })
                const options = {
                    expiresIn: '1m',
                    httpOnly: true
                }
                res.cookie("tkn", token, options).json({ response: "success", user: token })

                // res.send('login successfully !')
            }
            //invalid password
            else {

                res.status(402).json({ response: "Invalid Password !" })
            }
        }
        else {
            res.status(402).json({ response: "User Does Not Exist" })
        }
    }
})

//add clients 
app.post('/addclient', async (req, res) => {
    //get all data
    const { parentId, name } = req.body;
    console.log(parentId, name)
    if (!parentId || !name) {
        res.send({ response: "All fiels are required !" })
    }
    else {
        let ParentID = await authy(parentId, privetKey)
        console.log(ParentID)
        const result = await clients.create({ parentId: ParentID, name })
        console.log(result)
        result ? res.status(200).json({ response: "success" }) : res.status(402).json({ response: "Something went wrong !" })

    }
})

app.get('/clients', async (req, res) => {
    console.log("clients")
    // console.log(req.headers.token)
    i++
    const token = req.headers.token
    console.log(token)
    if (token) {
        let auth = await authy(req.headers.token, privetKey)
        console.log("ID:", auth._id)
        let result = await clients.aggregate([
            { "$match": { parentId: auth._id } },
            {
                "$project": {
                    "name": Infinity, "parentId": Infinity,
                    "totalAmount": {
                        "$sum": "$transactions.amount"
                    },

                }
            }
        ])

        res.send(result)
        console.log(result)

    }

    else {
        res.json({ response: "Unautherised user" })
    }

})
// add transaction
app.post('/client/newTransaction', async (req, res) => {
    const token = req.headers.token;
    const uid = req.headers.uid;
    console.log(req.body.amount)
    // console.log(req.headers.uid)
    const { amount, date, dis, type } = req.body;
    if (!token || !uid || !amount || !date || !dis || !type) {
        console.log("if")
        console.log(req.body)
        res.json({ response: "all fiels are required" })
    }
    else {
        const auth = await authy(token, privetKey)
        // console.log(auth)
        console.log(req.body)
        console.log("else")
        const result = await clients.updateOne({ _id: uid, parentId: auth._id }, {
            "$push": {
                "transactions": {
                    "amount": parseFloat(req.body.amount),
                    "date": req.body.date,
                    "dis": req.body.dis,
                    "type": req.body.type

                }
            }
        })
        console.log(result)
        if (result.modifiedCount == 1) {
            res.json({ response: "success" })
            console.log(result.modifiedCount)
        }
        else {
            res.json({ response: "Someting went wrong ! " })
        }
    }
})

app.get('/client/transactions', async (req, res) => {
    console.log('/client/transactions')
    const _id = req.headers.uid
    const token = req.headers.token
    if (!_id || !token) {
        res.json({ response: "invalid user" })
    }
    else {
        // console.log(token)
        const auth = await authy(token, privetKey)
        if (auth) {
            console.log(auth)
            const result = await clients.find({ _id, parentId: auth._id })
            // console.log(result)
            res.json({ response: result })
        }

    }

})
app.get('/clients/search', async (req, res) => {
    const token = req.header.token
    const auth = authy(token, privetKey)

})
// const test= async()=>{
//     const cl={
//         id:"331302",name:"p",age:12
//     }
//     const name="aj";
//    const result =await clients.create({parentId:{
//     name:"p",age:12
// },name})
//     console.log(result)
// }
// test()
app.listen(port, (err) => {
    if (err) throw err;
    console.log(`app is running on http://localhost:${port}`)
})



// {
//     "_id": "6381f9df0fa3a5755a801788",
//     "name": "pankaj",
//     "totalAmount": 108000
//   }