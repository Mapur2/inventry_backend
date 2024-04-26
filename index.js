require('dotenv').config()
const connectDB = require('./db/db')
const app = require('./app')


connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000, ()=>{
        console.log("Started app at ",process.env.PORT);
    })
})
.catch((err)=>{
    console.log("Cannot Start App");
})

