const bcrypt = require('bcryptjs');
const user = require("../Models/user.modal");
const ApiError = require("../utils/apiError.utils");
const ApiResponse = require("../utils/apiResponse.utils");
const jwtGenetator = require('../utils/jwtGenerator');
const clients = require('../Models/client.modal');
const share = require('../Models/share.modal');






// to register new user 

const register = async (req, res, next) => {

    try {
        // Extracting name, email, and password from request body
        const { name, email, pass } = req.body;

        const errorMessage = []
        // Checking if any required field is missing

        !name && errorMessage.push("Name is required")
        name && name?.length < 5 && errorMessage.push("Too shot name , minimum 5 characters required")
        name && name?.length > 12 && errorMessage.push("Too long name , maximum 12 characters allowed")
        !email && errorMessage.push("Email is required")
        !pass && errorMessage.push("Password is required")

        // if any of the fields are empty
        if (errorMessage.length > 0) {
            return next(new ApiError(400, errorMessage.join(' , ')));
        }

        // Check if user already exists
        const userExist = await user.findOne({ email });
        if (userExist) {
            return next(new ApiError(403, 'Email already exist'))
        }

        // Encrypting password
        const enPass = await bcrypt.hash(pass, 10);

        // Saving user data in database
        let query = await user.create({ name, email, pass: enPass });
        query = await query.toObject();

        // Removing sensitive data before sending response
        delete query.pass;
        delete query.email;

        // Generate JWT token for authentication
        const token = await jwtGenetator(query, "28d");

        // Configuring JWT token options
        const options = {
            expires: new Date(Date.now() + 27 * 24 * 60 * 60 * 1000),
            httpOnly: true
        };

        // Sending JWT token as a cookie along with registration success message
        return res.status(201).cookie("user", token, options).json(
            new ApiResponse(true, false, "Registration successful", "")
        );

    }
    catch (error) {
        // Handling errors
        console.log(error);
        let errorMessage = error.message;

        // Parsing and formatting error messages
        errorMessage = errorMessage.replaceAll('credit-users validation failed:', '');
        errorMessage = errorMessage.replace(' name: ', '');
        errorMessage = errorMessage.replace(' email: ', '');
        errorMessage = errorMessage.replace(' pass: ', '');

        next(new ApiError(400, errorMessage))
    }

}

// login user
const login = async (req, res, next) => {
    try {
        const { email, pass } = req.body;
        const errorMessage = []
        !email && errorMessage.push("Email is required")
        !pass && errorMessage.push("Password is required")

        // if any fields is missing
        if (errorMessage.length > 0) {
            return next(new ApiError(400, errorMessage.join(' , ')));
        }

        //find user by email
        const userExists = await user.findOne({ email });

        // if user not found
        if (!userExists) {
            // send error message to client
            return next(new ApiError(404, 'User does not exist'));
        }

        // compare password in bd vs entered password
        const isPasswordValid = await bcrypt.compare(pass, userExists.pass);

        // if password is incorrect
        if (!isPasswordValid) {
            // send error message to client
            return next(new ApiError(403, "Invalid password"))
        }

        // extract all values except _id
        const { name, email: userEmail, __v, token: tkn, ...userData } = userExists.toObject();

        // delete password 
        delete userData.pass;

        // generate jwt token for authentication
        const token = await jwtGenetator(userData, "28d")

        // if errror while generating token
        if (token.error) {
            // return error
            return next(new ApiError(500, "internal server error",));
        }
        // setting cookies options
        const cookieOptions = {
            expires: new Date(Date.now() + 27 * 24 * 60 * 60 * 1000),
            httpOnly: true
        };

        // return response with authorization token
        return res.status(201).cookie("user", token, cookieOptions).json(new ApiResponse(true, false, "login successfully", { user: token }));


    } catch (error) {
        //
        return next(new Error(error.message));
    }
}

// to logout user 
const logout = async (req, res, next) => {
    console.log(req.body);
    try {
        // clear cookies 

        res.clearCookie("user").json(new ApiResponse(true, false, "You've been successfully logged out. Thank you!"))

    } catch (error) {
        // if any error while logging out
        console.log("logout error: " + error)
        return next(new ApiError(500, error.message))
    }
}

// user profile 
const profile = async (req, res, next) => {
    const currentTime = Date.now()
    try {
        const { _id } = req.body.user
        console.log("parent =>", req.body.user)
        // console.log(`req recived  name=>${name} , _ID=>${_id} `)
        const { name } = await user.findOne({ _id })
        console.log("Name: " + name)
        const allClients = await clients.find({ parentId: _id }, { transactions: 0, parentId: 0 });
        let allSharedLinks = await share.find({ parentId: _id })

        allSharedLinks = allSharedLinks.map(({ shareToken, clientName, expireTime, _id }) => {
            return {
                linkId: _id,
                isActive: currentTime < expireTime,
                clientName, shareToken
            }

        })
        console.log("Name=>", name)
        console.log("all shared links =>", allSharedLinks)
        return res.status(200).json(
            new ApiResponse(true, false, "success", { name: name, symbol: name.charAt(0), allClients: allClients, allSharedLinks: allSharedLinks })
        )
    } catch (error) {
        return next(new ApiError(500, error.message));
    }
}
module.exports = {
    register,
    login,
    profile,
    logout
}