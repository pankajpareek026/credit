const mongoose = require('mongoose')

const url = process.env.MONGO_URL
console.log("connected 0")
const connectionParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}
mongoose.connect(url, connectionParams).then((e) => {
    // console.log(e)
    console.log("DB > connected")
}).catch((ee) => {
    console.info("ERR: ", ee)
})