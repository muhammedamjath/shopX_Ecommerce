const mongoose = require('mongoose');

const schema= new mongoose.Schema({
    code:{
        type:String,
        required:true
    },
    minamount:{
        type:String,
        required:true
    },
    maxamount:{
        type:String,
        required:true
    },
    discamount:{
        type:String,
        required:true
    }
})

const coupenschema=new mongoose.model('coupon',schema)
module.exports=coupenschema