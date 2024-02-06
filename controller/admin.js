const adminCollection=require('../model/adminscema')
const categoryCollection=require('../model/categorySchema')





// login get
exports.loginget=(req,res)=>{
    res.render('admin/login')
}

// login post
let mongoAdminData;
exports.loginpost=async(req,res)=>{
    mongoAdminData= await  adminCollection.findOne({email:req.body.email})
    if(req.body.password=== mongoAdminData.password){
        res.redirect('/admin/dashboard')
    }else{
        res.redirect('/admin')
    }
}

// Dashboard get
exports.dashboardGet=(req,res)=>{
    res.render('admin/dashboard',{mongoAdminData})
}

// catogory get

exports.catogoryGet=async(req,res)=>{
    const categories=await categoryCollection.find()
    res.render('admin/category',{mongoAdminData,categories})
}

exports.categoryPost=async (req,res)=>{
    
    try {
        const data= new categoryCollection({
            category:req.body.category,
            subcategory:[]
        })
        await data.save()
        res.status(200).json({})
    }
    catch(err){
        console.log(err);
    }
}