const { ApiError } = require("../utils/apiError.utils");
const jwtVerify = require("../utils/jwtVerify");

async function authy(req, res, next) {
    try {
        console.log(req.headers)
        var origin = req.get('origin');
        const token = req.cookies.user
        const cookies = req.cookies.user
        const pKey = process.env.PKEY
        const authToken = req.headers.token
        console.log("cookies=>>>>>", cookies)

        // Check if token is missing or undefined
        if (!authToken && cookies === "undefined") {
            // Respond with session expired error
            return res.status(401).json({ message: "Session expired , Login please ", type: "error", isSuccess: false, isError: true });
            // throw Error(401, "Session expired")
        }

        const tokenResult = await jwtVerify(authToken, pKey)
        console.log("TKN result =>", tokenResult)
        if (tokenResult.error) {
            const message = tokenResult.isExpired ? "session expired" : "unauthorized user access"
            return res.status(401).json({
                type: "error",
                message: message,
                isSuccess: false,
                isError: true
            })
        }

        req.body.user = tokenResult
        next()
    } catch (error) {
        // Handle internal server error
        console.log(error);
        res.status(500).json(
            {
                type: 'error',
                message: 'Internal server error!',
                isSuccess: false
                , isError: true
            });
    }
}

module.exports = authy