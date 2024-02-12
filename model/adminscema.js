const mongoose = require('mongoose');
const server=require('../model/mongodb')


// const adminScema=new mongoose.Schema({
//     name:{
//         type:String,
//         required:true
//     },
//     email:{
//         type:String,
//         required:true
//     }, 
//     password:{
//         typr:String,
//         required:true
//     }
// })

// const data= new mongoose.model('adminCollection',adminScema)

// module.exports=data

const adminCollection = mongoose.connection.collection('adminCollection');
module.exports=adminCollection