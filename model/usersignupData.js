const mongoose = require('mongoose');
const server=require('../model/mongodb')

const signupscema=new mongoose.Schema({

    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
    },
    mobno:{
        type:Number,
        required:true
    },
    password:{
        type:String,
        required:true
    }
})
 
const signupcollection=new mongoose.model('signupCollection',signupscema)
module.exports=signupcollection
 