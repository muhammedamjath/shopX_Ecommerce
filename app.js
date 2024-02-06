const express=require('express')
const app=express()
const ejs = require('ejs')
require('dotenv').config()



const port=process.env.port || 3000

app.set('view engine', 'ejs')
app.set('views','views')

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static('public'))

const admin=require('./router/admin')
const user=require('./router/user')
const commen=require('./router/common')

app.use("/admin",admin)
app.use("/user",user) 
app.use('/',commen)





app.listen(port,()=>{
    console.log(`server started in port ${port}`);
})