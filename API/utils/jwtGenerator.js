const jwt = require('jsonwebtoken')

const privetKey = "WeShoulHaveAStrongPriVaTeKek@24-12-2022"
async function jwtGenetator(content, time = '1s') {
    try {
        console.log("timestamp=>", time)
        const jwtToken = await jwt.sign(content, privetKey, { expiresIn: time })
        return jwtToken;
    } catch (error) {
        console.error("jwt Error:=>", error);
        return {
            error: true,
            message: error.message
        }
    }
}

// jwtGenetator({ _id: '65cb254655ae207175fe2901' },)
//     .then((d) => {
//         console.log(d)
//     })
module.exports = jwtGenetator