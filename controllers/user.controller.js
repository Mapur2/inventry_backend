const User = require('../models/user.model')
const ApiError = require('../utils/ApiError')
const ApiResponse = require('../utils/ApiResponse')
const asyncHandler = require('../utils/asyncHandler')
const { uploadOnCloudinary, deleteOnCloudindary } = require('../utils/cloudinary')
const jwt = require('jsonwebtoken')
const Product = require("../models/product.model")

const registerUser = asyncHandler(async (req, res) => {

    const { email, fullname, password, phone } = req.body
    if (!email || !fullname || !password || !phone)
        throw new ApiError(400, "All fields are required")

    if ([email, fullname, password, , phone].some((f) => f.trim() === ""))
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

const generateAccessToken = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        return accessToken
    } catch (error) {
        console.log(error)
        throw new ApiError(500, "Something went wrong while create refresh and access token")
    }
}

const loginUser = asyncHandler(async (req, res) => {
    //get email, 
    // find the user 
    // password check
    // access and refresh token
    //send  cookie

    const { email, password } = req.body
    //console.log(email, ,password)
    if (!email)
        throw new ApiError(400, "email is required")

    const user = await User.findOne({ email })
    //console.log(user)
    if (!user)
        throw new ApiError(404, "User does not exist")

    const passCheck = await user.isPasswordCorrect(password)

    if (!passCheck)
        throw new ApiError(404, "Password is invalid")

    const accesstoken = await generateAccessToken(user._id)

    const loggeduser = await User.findById(user._id, { fullname: 1, email: 1, phone: 1 })

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .cookie("accessToken", accesstoken, options)
        .json(
            new ApiResponse(200,
                {
                    user: loggeduser,
                    accesstoken,
                },
                "User logged in successfully"
            )
        )
})

const createBusiness = asyncHandler(async (req, res) => {
    const { business, business_email, whatsapp } = req.body
    const userId = req.user._id
    if (!business_email || !business || !whatsapp)
        throw new ApiError(400, "All fields are required")

    if ([business_email, business, whatsapp].some((f) => f.trim() === ""))
        throw new ApiError(400, "All fields are required")

    const user = await User.findByIdAndUpdate(userId, {
        "$set": {
            business,
            business_email,
            whatsapp
        }
    }, {
        new: true
    })
    if (!user)
        throw new ApiError(404, "Invalid user id")

    return res.status(200)
        .json(new ApiResponse(200, user, "Created Business successfully"))
})



module.exports = { registerUser, loginUser, createBusiness}