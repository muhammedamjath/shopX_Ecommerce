const mongoose = require('mongoose');

const category= new mongoose.Schema({
    category:{
        type:String,
        // required:true
    },
    subcategory:{
        type:Array,
        // required:true
    },
    image:{
        type:String,
    }
})

const categoryCollection=new mongoose.model('categoryCollection',category)
module.exports=categoryCollection