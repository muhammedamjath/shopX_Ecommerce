const mongoose = require('mongoose');
const server=require('../model/mongodb')

const category= new mongoose.Schema({
    category:{
        type:String,
        // required:true
    },
    subcategory:{
        type:Array,
        // required:true
    }
})

const categoryCollection=new mongoose.model('categoryCollection',category)
module.exports=categoryCollection