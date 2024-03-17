const { ApiError } = require("../utils/apiError.utils");
const jwtVerify = require("../utils/jwtVerify");

async function authy(req, res, next) {
    try {
        var origin = req.get('origin');
        const token = req.cookies.user
        const cookies = req.cookies.user
        const pKey = process.env.PKEY
        console.log("cookies=>>>>>", cookies)

        // Check if token is missing or undefined
        if (!token || token === "undefined") {
            // Respond with session expired error
            return res.status(401).json({ message: "Session expired , Login please ", type: "error", isSuccess: false, isError: true });
            // throw Error(401, "Session expired")
        }


        // Verify JWT token
        // jwt.verify(token, privetKey, (err, decodedToken) => {
        //     // If error occurs during token verification
        //     if (err) {
        //         // Handle invalid signature error
        //         if (err.message === 'invalid signature') {

        //             return res.status(401).json(
        //                 {
        //                     type: 'error',
        //                     message: 'Unauthorized user access!'
        //                     , isSuccess: false
        //                     , isError: true
        //                 });
        //         }
        //         // Handle other errors during token verification
        //         return res.status(500).json(
        //             {
        //                 type: 'error',
        //                 message: err.message,
        //                 isSuccess: false,
        //                 isError: true
        //             });
        //     } else {
        //         // If token is valid, attach decoded user information to request body
        //         req.body.user = decodedToken;
        //         // Proceed to the next middleware or route handler
        //         next();
        //     }
        // });
        const tokenResult = await jwtVerify(token, pKey)
        if (tokenResult.error) {
            const message = tokenResult.isExpired ? "session expired" : "unauthorized user access"
            return next(new ApiError(401, message))
        }

        req.body.user = tokenResult
        next()
    } catch (error) {
        // Handle internal server error
        // console.log(error);
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