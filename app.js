const express = require('express');
const app =express()
const cors = require('cors');
const cookieParser = require('cookie-parser');

app.use(cors({
    origin:["https://inventory-manager-beige.vercel.app","http://localhost:5173"],
    credentials:true,
    methods:'*'
}))

app.set('view engine', 'ejs');

app.use(express.json({limit:'16kb'}))
app.use(express.urlencoded({
    extended:true
}))
app.use(express.static('./public'))
app.use(cookieParser())

//routes

const userRouter = require('./routes/user.router.js')

app.use('/api/v1/users',userRouter)


module.exports=app
