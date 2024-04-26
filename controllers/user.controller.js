const User = require('../model/user.model')
const ApiError = require('../utils/ApiError')
const ApiResponse = require('../utils/ApiResponse')
const asyncHandler = require('../utils/asyncHandler')
//const { uploadOnCloudinary, deleteOnCloudindary } = require('../utils/cloudinary')
const jwt = require('jsonwebtoken')

const registerUser = asyncHandler(async (req, res) => {

    const { email, fullname, password, username,phone } = req.body
    if (!email || !fullname || !password || !username ||!phone)
        throw new ApiError(400, "All fields are required")

    if ([email, fullname, password, username, phone].some((f) => f.trim() === ""))
        throw new ApiError(400, "All fields are required")

    const userExists = await User.findOne({ email: email })
    if (userExists) {
        throw new ApiError(409, "User allready exists")
    }

    const newUser = await User.create({
        fullname: fullname,
        email,
        password,
        phone
    })

    const createdUser = await User.findById(newUser._id).select("-password")

    if (!createdUser)
        throw new ApiError(500, "Something went wrong while creating the user")

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    )
})


