const mongoose = require('mongoose');
const connectDB=async ()=>{
    try{
        const connect = await mongoose.connect(`${process.env.MONGO_URI}`)
        console.log("Mongo Connected: ", connect.connection.host)
    }
    catch(err){
        console.log("Mongo Connect Error",err)
        process.exit(1)
    }
}

module.exports= connectDB