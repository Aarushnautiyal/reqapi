const express = require("express")
const connectDB = require("./config/db")
const mongoose = require('mongoose')
const app = express()
const path = require('path')

// connecting db

connectDB()

// Init middleware for body parser using express

app.use(express.json({extended:false}))




app.use("/api/user",require('./routes/api/user'))
app.use("/api/auth",require('./routes/api/auth'))
app.use("/api/profile",require('./routes/api/profile'))
app.use("/api/post",require('./routes/api/post'))

//serve static asset in production
if(process.env.NODE_ENV === 'production'){
    // set static folder
    app.use(express.static('client/build'))

    app.get('*',(req,res)=>{
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
}

const port = process.env.PORT||5000


app.listen(port,()=>{console.log(`server listening on ${port}`)})





