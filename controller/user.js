const bannercollection= require('../model/banner')
const categorycollection=require('../model/categorySchema')
const productcollection=require('../model/addproductScema')

// user home
exports.homeget=async(req,res)=>{
    const banner= await bannercollection.find()
    const categories=await categorycollection.find()
    const product=await productcollection.find().limit(10)
    res.render('user/home',{banner,categories,product})
} 

// showing all product
// exports.getallproduct=(req,res)=>{
//     res.render('user/showallproduct')
// }
