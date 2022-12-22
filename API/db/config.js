const mongoose = require('mongoose')
const url = "mongodb+srv://ecom-01:PwEkECJdSt8WQCjj@cluster0.16tcspz.mongodb.net/?retryWrites=true&w=majority"
console.log("connected 0")
const connectionParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}
mongoose.connect(url, connectionParams).then((e) => {
    console.log(e)
    console.log("connected")
}).catch((ee) => {
    console.info("ERR: ", ee)
})