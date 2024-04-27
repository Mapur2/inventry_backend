const jwt = require('jsonwebtoken');
const ApiError = require('../utils/ApiError');
const User = require('../models/user.model');
const asyncHandler = require('../utils/asyncHandler');

const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
        if (!token)
            throw new ApiError(404, "Unauthorized Access")

        const decodedToken = jwt.verify(token, `${process.env.ACCESS_TOKEN}`)
        const user = await User.findById(decodedToken._id).select("-password")
        //console.log(user)
        if (!user) {
            throw new ApiError(401, "Invalid access Token")
        }
        //console.log(req)
        req.user = user
        next()
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid Access Token")
    }
})

module.exports = verifyJWT