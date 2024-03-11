const mongoose = require('mongoose');

const schema= new mongoose.Schema({
    code:{
        type:String,
        required:true
    },
    minamount:{
        type:Number,
        required:true
    },
    maxamount:{
        type:Number,
        required:true
    },
    discamount:{
        type:Number,
        required:true
    }
})

const coupenschema=new mongoose.model('coupon',schema)
module.exports=coupenschema