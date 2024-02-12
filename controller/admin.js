const adminCollection=require('../model/adminscema')
const categoryCollection=require('../model/categorySchema')
const additemCollection=require('../model/addproductScema')
const upload=require('../middileware/multer')
const signupcollection=require('../model/usersignupData')




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
let categories;
exports.catogoryGet=async(req,res)=>{
    categories=await categoryCollection.find()
    res.render('admin/category',{mongoAdminData,categories})
}


// category post in admin side 
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

// sub category get in admin side
exports.getsubcategory= async (req,res)=>{
    const categoryId = req.query.categoryId;
    const subCategoryData= await categoryCollection.findById(categoryId)
    res.status(200).json({subCategoryData:subCategoryData ,mongoAdminData:mongoAdminData ,categories:categories})
}   

// subcategory post/updation in admin side
exports.postSubCategory=async(req,res)=>{
    const categoryId = req.params.categoryId;
    const { subcategory } = req.body;
  
   try{
        const subdata =await categoryCollection.findByIdAndUpdate(
            categoryId,
            {$push:{subcategory:subcategory}},
            {new:true}
        )
        if(!subdata){
            return res.status(404).json({ error: "Category not found" });
        }
        res.status(200).json(subdata)
    }
    catch(err){
        console.log(' the error is ',err);
    }
}

// add product get 
exports.getaadProduct=async(req,res)=>{
    const itemdata=await categoryCollection.find()
    // console.log(itemdata);
    res.render('admin/aadproduct',{mongoAdminData,itemdata})
}


// using multer 
exports.multerpost=upload.array('image', 4)

// add product post
exports.postaddproduct=async (req,res)=>{
    

    const path= req.files.map((file)=>"images/" + file.filename)

    const postdata=new additemCollection({
        name : req.body.name ,
        prize : req.body.prize ,
        offerprize : req.body.offerprize ,
        stock : req.body.stock ,
        category : req.body.category ,
        subCategory : req.body.subCategory ,
        image : path ,
        size : req.body.size , 
        color : req.body.color
    }) 
    if(postdata){
        await postdata.save()
        console.log('product saved successfully');
        res.redirect('/admin/aadproduct')
    }else{
        res.redirect('/admin/aadproduct')
    }
} 

// userlist get
exports.userlistget=async(req,res)=>{
    const userlistdata= await signupcollection.find()
    const usersCount= await signupcollection.countDocuments()
    res.render('admin/usersList',{userlistdata,mongoAdminData,usersCount})
}
