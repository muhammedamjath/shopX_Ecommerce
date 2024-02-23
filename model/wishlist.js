const mongoose = require('mongoose');
const server=require('../model/mongodb')


const wishlist=new mongoose.Schema({
    id:{
        type:String,
        required:true
    },
    proId:{
        type:Array,
        required:true
    }
})

const wishlistSchema= new mongoose.model('wishlist',wishlist)
module.exports=wishlistSchema