const jwt = require('jsonwebtoken')

const privetKey = "WeShoulHaveAStrongPriVaTeKek@24-12-2022"
async function jwtGenetator(content) {
    const jwtToken =await jwt.sign(content, privetKey, { expiresIn: 24*60*60 })
    return jwtToken;
}
module.exports = jwtGenetator