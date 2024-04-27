const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true,
    },
    quantity:{
        type:Number,
        required:true,
    },
    unitType:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    imageId:{
        type:String,
        required:true
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
},
{
    timestamps:true
})

module.exports = mongoose.model("Product",productSchema)