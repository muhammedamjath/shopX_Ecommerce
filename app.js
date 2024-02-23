const express=require('express')
const app=express()
const ejs = require('ejs')
require('dotenv').config()
const session = require('express-session')
const port=process.env.port || 3000
const secret=process.env.secret

app.set('view engine', 'ejs')
app.set('views','views')

// session 
app.use(session({
    secret,
    resave: false,
    saveUninitialized: true
  }))  

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static('public'))

// Import all routes
const admin=require('./router/admin')
const user=require('./router/user')
const commen=require('./router/common')


// use routes
app.use("/admin",admin)
app.use("/user",user) 
app.use('/',commen)

// Make application listenable
app.listen(port,()=>{
    console.log(`server started in port ${port}`);
})