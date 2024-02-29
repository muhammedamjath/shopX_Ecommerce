const mongoose = require('mongoose');
const server=require('../model/mongodb')

const schema=new mongoose.Schema({
    id:{
        type: mongoose.Types.ObjectId,
        required:true
    },
    name:{
        type:String
    },
    Image:{
        type:String
    },
    gender:{
        type:String
    },
    dob:{
        type:String
    },
    housename:{
        type:String
    },
    Streetname:{
        type:String
    },
    post:{
        type:String
    },
    pincode:{
        type:Number
    },
    district:{
        type:String
    },
    state:{
        type:String
    }
})

const profileschema= new mongoose.model('userProfile',schema)
module.exports=profileschema