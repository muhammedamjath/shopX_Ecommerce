const mongoose = require('mongoose');
require('../model/mongodb')


const Schema= new mongoose.Schema({
    image:{
        type:String,
        require:true
    },
    url:{
        type:String
    },
    status:{
        type:String,
        default:'Active'
    }
})

const bannerschema =new mongoose.model('banner',Schema)
module.exports=bannerschema