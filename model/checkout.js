const mongoose=require('mongoose')

const schema= new mongoose.Schema({
    userId:{
        type:mongoose.Types.ObjectId,
        required:true,
    },
    orderDetailes:[{
        product:[{
            id:{
                type:mongoose.Types.ObjectId,
            },
            offerprice:{
                type:Number,
            },
            color:{
                type:String,
            },
            count:{
                type:Number
            }
        }],
        house:{
            type:String,
            required:true
        },
        pincode:{
            type:Number,
            required:true
        },
        district:{
            type:String,
            required:true
        },
        state:{
            type:String,
            required:true
        },
        name:{
            type:String,
            required:true
        },
        mobno:{
            type:Number,
            required:true
        },
        email:{
            type:String,
            required:true
        },
        couponId:{
            type:mongoose.Types.ObjectId,
        },
        peymentMethord:{
            type:String,
            required:true
        },
        subtotal:{
            type:Number,
            required:true
        },
        shippingCharge:{
            type:String,
            required:true
        },
        discount:{
            type:Number
        },
        totalAmount:{
            type:Number,
            required:true
        }
    }],
    orderSatatus:{
        type:String,
        default:"placed"
    },
    createdAt: {
        type: Date,
        default: Date.now
      }
})

const checoutcollections= new mongoose.model('checkout',schema)
module.exports=checoutcollections