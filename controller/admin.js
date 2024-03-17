const adminCollection = require("../model/adminscema");
const categoryCollection = require("../model/categorySchema");
const additemCollection = require("../model/addproductScema");
const upload = require("../middileware/multer");
const signupcollection = require("../model/usersignupData");
const bannercollection = require("../model/banner");
const coupenschema = require("../model/coupon");
const checoutcollections = require("../model/checkout");
const { default: mongoose } = require("mongoose");

// login get
exports.loginget = (req, res) => {
  res.render("admin/login");
};

// login post
let mongoAdminData;
exports.loginpost = async (req, res) => {
  mongoAdminData = await adminCollection.findOne({ email: req.body.email });
  if (req.body.password === mongoAdminData.password) {
    res.redirect("/admin/dashboard");
  } else {
    res.redirect("/admin");
  }
};

// Dashboard get
exports.dashboardGet = (req, res) => {
  res.render("admin/dashboard", { mongoAdminData });
};

// catogory get
let categories;
exports.catogoryGet = async (req, res) => {
  categories = await categoryCollection.find();
  res.render("admin/category", { mongoAdminData, categories });
};

// category post in admin side
exports.categoryPost = async (req, res) => {
  try {
    const data = new categoryCollection({
      category: req.body.category,
      subcategory: [],
      image: "images/" + req.file.filename,
    });
    await data.save();
    const catData = await categoryCollection.find();
    res.status(200).json({ categories: catData });
  } catch (err) {
    console.log(err);
  }
};

// categorydelete with axios
exports.deletecategory = async (req, res) => {
  const id = req.params.id;
  try {
    await categoryCollection.findByIdAndDelete(id);
    res.status(200).json({});
  } catch (err) {
    console.log(err);
  }
};

// previews category delete
exports.delcategory = async (req, res) => {
  const id = req.params.id;
  try {
    await categoryCollection.findByIdAndDelete(id);
    res.status(200).json({});
  } catch (err) {
    console.log("the err is ", err);
  }
};

// subcategory delete with axios
exports.subdelete = async (req, res) => {
  const id = req.params.id;
  const item = req.body.subcategoryName;
  try {
    await categoryCollection.findByIdAndUpdate(
      id,
      { $pull: { subcategory: item } },
      { new: true }
    );
    res.status(200).json({});
  } catch (err) {
    console.log(err);
  }
};

// sub category get in admin side
exports.getsubcategory = async (req, res) => {
  const categoryId = req.query.categoryId;
  const subCategoryData = await categoryCollection.findById(categoryId);
  res.status(200).json({
    subCategoryData: subCategoryData,
    mongoAdminData: mongoAdminData,
    categories: categories,
  });
};

// subcategory post/updation in admin side
exports.postSubCategory = async (req, res) => {
  const categoryId = req.params.categoryId;
  const { subcategory } = req.body;

  try {
    const subdata = await categoryCollection.findByIdAndUpdate(
      categoryId,
      { $push: { subcategory: subcategory } },
      { new: true }
    );
    if (!subdata) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.status(200).json(subdata);
  } catch (err) {
    console.log(" the error is ", err);
  }
};

// add product get
exports.getaadProduct = async (req, res) => {
  const itemdata = await categoryCollection.find();
  res.render("admin/aadproduct", { mongoAdminData, itemdata });
};

// using multer
exports.multerpost = upload.upload.array("image", 4);

// using multer2
exports.multer1 = upload.upload2.single("image");

// add product post
exports.postaddproduct = async (req, res) => {
  const path = req.files.map((file) => "images/" + file.filename);
  let name = req.body.name;

  //checking the first letter is capital
  if (name.charAt(0) === name.charAt(0).toUpperCase()) {
    true;
  } else {
    name = name.charAt(0).toUpperCase() + name.slice(1);
  }
  const prize = req.body.prize;
  const offerprize = req.body.offerprize;

  percentage = 100 - Math.round((offerprize / prize) * 100);

  const postdata = new additemCollection({
    name: name,
    prize: req.body.prize,
    offerprize: req.body.offerprize,
    prizePercenttage: percentage,
    stock: req.body.stock,
    category: req.body.category,
    subCategory: req.body.subCategory,
    image: path,
    brand: req.body.brand,
    size: req.body.size,
    color: req.body.color,
    discription: req.body.discription,
  });
  if (postdata) {
    await postdata.save();
    console.log("product saved successfully");
    res.redirect("/admin/aadproduct");
  } else {
    res.redirect("/admin/aadproduct");
  }
};

// userlist get
exports.userlistget = async (req, res) => {
  const userlistdata = await signupcollection.find();
  const usersCount = await signupcollection.countDocuments();
  res.render("admin/usersList", { userlistdata, mongoAdminData, usersCount });
};

// productlist get
let productdata;
let productcount;
exports.productlistget = async (req, res) => {
  productcount = await additemCollection.countDocuments();
  productdata = await additemCollection.find();
  res.render("admin/showproduct", {
    mongoAdminData,
    productdata,
    productcount,
  });
};

// delete item
exports.deleteitem = async (req, res) => {
  const id = req.params.id;

  const product = await additemCollection.findById(id);
  if (!product) {
    console.log("item not fount");
  } else {
    await additemCollection.findByIdAndDelete(id);
    console.log("item deleted");
    res.redirect("/admin/showproduct");
  }
};

// eidt the product
exports.editproduct = async (req, res) => {
  const id = req.params.id;
  const categoryData = await categoryCollection.find();
  const data = await additemCollection.findById(id);
  res.render("admin/edititem", { data, mongoAdminData, categoryData });
};

// post edit product
exports.postEdit = async (req, res) => {
  const proId = req.params.editId;
  const data = await additemCollection.findById(proId);
  const prizeE = req.body.prize;
  const offerprizeE = req.body.offerprize;
  percentage = 100 - Math.round((offerprizeE / prizeE) * 100);
  const {
    name,
    prize,
    offerprize,
    category,
    subCategory,
    size,
    brand,
    color,
    discription,
  } = req.body;
  const id = data._id;
  const path = req.files.map((file) => "images/" + file.filename);
  try {
    await additemCollection.findByIdAndUpdate(id, {
      $set: {
        name: name,
        prize: prize,
        offerprize: offerprize,
        category: category,
        subCategory: subCategory,
        prizePercenttage: percentage,
        image: path,
        size: size,
        color: color,
        discription: discription,
        brand: brand,
      },
    });
    console.log("product updated successfully");
    res.redirect("/admin/showproduct");
  } catch (err) {
    console.log(err);
  }
};

// changing the status of user
exports.changeStatus = async (req, res) => {
  const dataId = req.params.id;
  const data = await signupcollection.findById(dataId);
  const newStatus = data.status === "Active" ? "Blocked" : "Active";
  try {
    await signupcollection.findByIdAndUpdate(
      dataId,
      {
        $set: {
          status: newStatus,
        },
      },
      { new: true }
    );
    res.redirect("/admin/usersList");
  } catch (err) {
    console.log(err);
  }
};

// change the status of product
exports.productStatus = async (req, res) => {
  const id = req.params.id;
  const data = await additemCollection.findById(id);
  const newStatus = data.status === "Active" ? "Blocked" : "Active";
  try {
    await additemCollection.findByIdAndUpdate(
      id,
      {
        $set: {
          status: newStatus,
        },
      },
      { new: true }
    );
    res.redirect("/admin/showproduct");
  } catch (err) {
    console.log(err);
  }
};

// banner get
exports.bannerget = async (req, res) => {
  const banner = await bannercollection.find();
  res.render("admin/banner", { mongoAdminData, banner });
};

// banner post
exports.bannerpost = async (req, res) => {
  const filedata = req.file;
  const path = "images/" + filedata.filename;
  const bannerdata = new bannercollection({
    url: req.body.url,
    image: path,
  });
  await bannerdata.save();
  res.redirect("/admin/banner");
};

// banner delete
exports.deletebanner = async (req, res) => {
  const id = req.params.id;
  await bannercollection.findByIdAndDelete(id);
  res.redirect("/admin/banner");
};

// update banner status
exports.bannerstatus = async (req, res) => {
  const id = req.params.id;
  const data = await bannercollection.findById(id);
  const currentStatus = data.status === "Active" ? "Bolcked" : "Active";
  try {
    await bannercollection.findByIdAndUpdate(
      id,
      {
        $set: { status: currentStatus },
      },
      { new: true }
    );
    res.redirect("/admin/banner");
  } catch (err) {
    console.log(err);
  }
};

// coupon get
exports.couponget = (req, res) => {
  res.render("admin/coupon");
};

// coupon post
exports.couponpost = async (req, res) => {
  const { minamount, maxamount, discamount, Code } = req.body;
  const UpperCase = Code.toUpperCase();
  console.log(UpperCase);

  try {
    const coupon = new coupenschema({
      code: UpperCase,
      minamount: minamount,
      maxamount: maxamount,
      discamount: discamount,
    });

    await coupon.save();
    res.redirect("/admin/coupon");
  } catch (err) {
    console.log(err);
  }
};

// orders list get
exports.orderslist = async (req, res) => {
  const orders = await checoutcollections.find();
  let datas = [];
  for (let i of orders) {
    let userid = i.userId;
    for (let j of i.orderDetailes) {
      const obj = { userid: userid, orders: j };
      datas.push(obj);
    }
  }
  if(datas.length>0){
    res.render("admin/orders",{datas});
  }else{
    res.render("admin/orders",{datas:[]});
  }
};

// single order  get
exports.getsingleorder=async(req,res)=>{
  const userId= req.params.userId
  const orderId= req.params.orderId
 
  const userDetailes= await signupcollection.findOne({_id:userId},{password:0})
  const orderData= await checoutcollections.findOne({userId:userId})
  let objdata;
  let product=[]
  for( let i of orderData.orderDetailes){
      if(i._id == orderId ){
        objdata=i
        for ( let j of i.product){
          const finditem= await additemCollection.findById(j.id)
          const image=finditem.image[0]
          const data={image:image,otherDetailes:j}
          product.push(data)
        }
      }

  }
 res.render('admin/orderSingle',{userDetailes,objdata,product,userId})
}

// order status updating
exports.statusupdate=async(req,res)=>{
  const status = req.body.selectedValue;
    const userId = req.body.userId;
    const orderId=req.body.orderId
    const checkData= await checoutcollections.findOneAndUpdate(
      {userId:userId,"orderDetailes._id":orderId},
      {$set:{"orderDetailes.$.orderSatatus":status}}
      )
      if(checkData){
        res.status(200).json({})
      }

}