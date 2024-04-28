const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true,
        trim: true,
    },
    phone: {
        type: Number,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    business: {
        type: String,
        trim: true,
        default:null
    },
    whatsapp: {
        type: Number,
        default:null,
    },
    business_email: {
        type: String,
        lowercase: true,
        trim: true,
        default:null
    }
},
    {
        timestamps: true
    })

userSchema.pre('save', async function (next) {

    if (!this.isModified("password"))
        return next()

    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function () {
    return jwt.sign({
        _id: this._id,
        email: this.email,
        fullname: this.fullname
    }, `${process.env.ACCESS_TOKEN}`,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        })
}

module.exports = mongoose.model("User",userSchema)
