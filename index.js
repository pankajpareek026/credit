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
//meddilswares
const privetKey = "WeShoulHaveAStrongPriVaTeKek@24-12-2022"
let i = 0
app.use(express.json())
app.use(cookieParser())
app.use(cors())
//
const port = process.env.port || 2205

async function authy(req, res, next) {

    if (req.headers.token) {
        const user = jwt.verify(req.headers.token, privetKey, (err, valid) => {
            if (err) {
                res.json({ response: err.message })
                console.log("AUTHY ERROR :", err)
            }
            else {
                req.body.user = valid;
                next()
            }
        })
    }
    else {
        res.json({ response: "some thing went wrong !" })
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
            //if password valid 
            if (status) {
                result = await result.toObject()
                // delete result.name
                delete result.pass
                delete result.email;

                const token = jwt.sign(result, privetKey, {
                    expiresIn: "2d"
                })
                const options = {
                    expiresIn: '2d',
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
app.post('/addclient', authy, async (req, res) => {
    //get all data

    const parentId = req.body.user._id
    const name = req.body.name

    if (!parentId || !name) {
        res.send({ response: "All fiels are required !" })
    }
    else {

        const result = await clients.create({ parentId, name })

        result ? res.status(200).json({ response: "success" }) : res.status(402).json({ response: "Something went wrong !" })

    }

})

// search the user from dashboard search bar
let hit = 0
app.get('/search', authy, async (req, res) => {

    hit++;
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
        res.json({ response: result })
    }
    else {
        res.json({ response: "Not Found !" })
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

    res.json({ response: "hitted" })
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

                }
            }
        ])

        if (result) { res.json({ response: result }) }
        else {
            res.json({ response: "Not Found !" })
        }
    }
    else {
        res.json({ response: "Unautherised user" })
    }
})
// to add new transactions in users page
app.post('/client/newTransaction', authy, async (req, res) => {
    const parentId = req.body.user._id
    const _id = req.headers.uid


    const { amount, date, dis, type } = req.body;
    if (!parentId || !_id || !amount || !date || !dis || !type) {

        res.json({ response: "all fiels are required" })
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
            res.json({ response: "success" })

        }
        else {
            res.json({ response: "Someting went wrong ! " })
        }
    }
})
app.get('/client/transactions', authy, async (req, res) => {

    const _id = req.headers.uid
    const parentId = req.body.user._id;
    if (!_id || !parentId) {
        res.json({ response: "invalid user" })
    }
    else {

        const result = await clients.find({ _id, parentId })

        res.json({ response: result })
    }
})

app.listen(port, (err) => {
    if (err) throw err;
    console.log(`app is running on http://localhost:${port}`)
})









