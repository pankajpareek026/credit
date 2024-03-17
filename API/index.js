//moduls
const Pkey = process.env.jwt_key
require('dotenv').config()
const cors = require('cors')
const express = require('express')
const cookieParser = require('cookie-parser')
require('./db/config.js')
const app = express()
const errorHandler = require('./middlewares/errorHandler.middleware.js')
const userRouter = require('./routes/user.route.js')
const clientRouter = require('./routes/client.route.js')
const shareRouter = require('./routes/share.route.js')
const transactionRouter = require('./routes/transaction.route.js')


//meddilswares
app.use(express.json())
app.use(cookieParser());

app.use(cors({
    origin: process.env.CROSS_ORIGIN,//client url
    credentials: true
}))
// app.use(function (req, res, next) {
//     res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
//     res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Accept,query,token,clietnId,clientName,shareid,tid,uid,clientid,parentid,sharetoken');
//     res.setHeader('Access-Control-Allow-Credentials', true);
//     // res.setHeader("access-control-allow-params", 'tId')
//     next();
// })
//


// routes
app.use(userRouter)
app.use(clientRouter);
app.use(transactionRouter);
app.use(shareRouter);

// error handler middleware
app.use(errorHandler)



const port = process.env.port || 2205

app.listen(port, (err) => {
    if (err) throw err;
    console.log(`app is running on http://localhost:${port}`)
})












