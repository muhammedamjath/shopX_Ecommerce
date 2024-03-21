const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    userId:{
        type:String,
        required:true
    },
    productId:{
        type:[{
            id:{
                type: mongoose.Types.ObjectId,
                ref:"additemCollection",                
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