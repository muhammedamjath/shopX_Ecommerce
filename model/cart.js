const mongoose = require('mongoose');
const server=require('../model/mongodb')

const schema = new mongoose.Schema({
    userId:{
        type:String,
        required:true
    },
    productId:{
        type:[{
            id:{
                type:String,
                required:true
            },
            count:{
                type:Number,
                default:1
            }
        }]
    }
})

const cartschema= mongoose.model('cart',schema)
module.exports=cartschema