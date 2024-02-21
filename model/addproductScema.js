const mongoose = require('mongoose');
const server=require('../model/mongodb');
const { array } = require('../middileware/multer');


const productData= new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    prize:{
        type:Number,
        required:true
    },
    offerprize:{
        type:Number,
    },
    stock:{
        type:Number,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    subCategory:{
        type:String,
        required:true
    },
    image:{
        type:Array,
        required:true
    },
    size:{
        type:String,
    },
    color:{
        type:String,
    },
    discription:{
        type:String,
    },
    status:{
        type:String,
        default:'Active'
    },
    prizePercenttage:{
        type:Number,
        required:true
    },
    brand:{
        type:String
    }
})  

const additemCollection=new  mongoose.model('additemCollection',productData)

module.exports=additemCollection