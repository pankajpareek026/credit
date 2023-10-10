const jwt=require('jsonwebtoken');
const privetKey = "WeShoulHaveAStrongPriVaTeKek@24-12-2022"
async function jwtVerify(token)
{

try {
    const tokenVerificationResult = await jwt.verify(token, privetKey)
    return tokenVerificationResult

} catch (error) {
    return error.message
}
}
module.exports=jwtVerify