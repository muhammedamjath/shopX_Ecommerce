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
    res.render('admin/aadproduct',{mongoAdminData,itemdata})
}


// using multer 
exports.multerpost=upload.array('image', 4)

// add product post
exports.postaddproduct=async (req,res)=>{
    const path= req.files.map((file)=>"images/" + file.filename)
    let name = req.body.name;

    //checking the first letter is capital
    if (name.charAt(0) === name.charAt(0).toUpperCase()) {
       true
    } else {
        name = name.charAt(0).toUpperCase() + name.slice(1);
    }


    const postdata=new additemCollection({
        name : name ,
        prize : req.body.prize ,
        offerprize : req.body.offerprize ,
        stock : req.body.stock ,
        category : req.body.category ,
        subCategory : req.body.subCategory ,
        image : path ,
        size : req.body.size , 
        color : req.body.color,
        discription:req.body.discription
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

// productlist get
let productdata;
let productcount;
exports.productlistget=async(req,res)=>{
    productcount= await additemCollection.countDocuments()
    productdata =await additemCollection.find()
    res.render('admin/showproduct',{mongoAdminData,productdata,productcount})
} 

// delete item
exports.deleteitem= async(req,res)=>{
    const id=req.params.id
     
    const product= await additemCollection.findById(id)
   if(!product){
    console.log('item not fount');
   }else{
        await additemCollection.findByIdAndDelete(id)
        console.log('item deleted');
        res.redirect('/admin/showproduct')
   }
}

// eidt the product
exports.editproduct= async (req,res)=>{
    const id=req.params.id
    const categoryData= await categoryCollection.find()
    const data = await additemCollection.findById(id)
    res.render('admin/edititem',{data,mongoAdminData,categoryData})
} 

// post edit product
exports.postEdit=async (req,res)=>{
    const proId = req.params.editId
    const data= await additemCollection.findById(proId)
    const  {name,prize,offerprize,category,subCategory,size,color,discription}=req.body
    const id=data._id
    const path= req.files.map((file)=>"images/" + file.filename)
    try{
        await additemCollection.findByIdAndUpdate(
            id,{
                $set:{
                    name : name,
                    prize : prize,
                    offerprize : offerprize,
                    category : category,
                    subCategory : subCategory,
                    image : path,
                    size:size,
                    color:color,
                    discription:discription
                }
            }
        )
        console.log('product updated successfully');
        res.redirect('/admin/showproduct')
    }
    catch(err){
        console.log(err);
    }
}

// changing the status of user
exports.changeStatus= async (req,res)=>{
    const dataId = req.params.id
    const data = await signupcollection.findById(dataId)
    const newStatus = data.status === 'Active' ? 'Blocked' : 'Active'; 
    try{
        await signupcollection.findByIdAndUpdate(
            dataId,{
                $set : {
                    status : newStatus
                }
            },
            {new:true}
        )
        res.redirect('/admin/usersList')
    }
    catch(err){
        console.log(err);
    } 
}