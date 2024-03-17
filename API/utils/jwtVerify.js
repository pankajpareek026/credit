const jwt = require('jsonwebtoken');
const privetKey = "WeShoulHaveAStrongPriVaTeKek@24-12-2022"
async function jwtVerify(token) {

    try {
        const tokenVerificationResult = await jwt.verify(token, privetKey)
        return tokenVerificationResult

    } catch (error) {
        return {
            error: true,
            message: error.message === "jwt expired" ? "session expired" : error.message,
            isExpires: error.message === "jwt expired"
        }
    }
}

const pKey = "WeShoulHaveAStrongPriVaTeKek@24-12-2022"
const tkn = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ1.eyJfaWQiOiI2NWNiMjU0NjU1YWUyMDcxNzVmZTI5MDEiLCJpYXQiOjE3MDk0ODYxMzYsImV4cCI6MTcwOTQ4NjEzN30.rsBE-xkiAn89xTgAeMwR2I0num1a7Eq3FPJgIyoIDUw"

// jwtVerify(tkn, pKey).then((response) => {
//     console.log(response)
// })

module.exports = jwtVerify