const mongoose = require("mongoose");


const schema= new mongoose.Schema({
    productId:{
        type:mongoose.Types.ObjectId,
        required:true
    },
    userId:{
        type:mongoose.Types.ObjectId,
        required:true
    },
    review:{
        type:String,
        
    },
    starcount:{
        type:Number,

    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})

const reviewschema= new mongoose.model('review',schema)
module.exports=reviewschema