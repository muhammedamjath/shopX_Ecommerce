const bannercollection = require("../model/banner");
const categorycollection = require("../model/categorySchema");
const productcollection = require("../model/addproductScema");
const wishlistCollection = require("../model/wishlist");
const signupCollection = require("../model/usersignupData");

// user home
exports.homeget = async (req, res) => {
  if (req.session.email) {
    const banner = await bannercollection.find();
    const categories = await categorycollection.find();
    const product = await productcollection
      .find({ status: "Active" })
      .limit(10);
    res.render("user/home", { banner, categories, product });
  } else {
    res.render("common/login");
  }
};

// showing all product
exports.getallproduct = async (req, res) => {
  const items = await productcollection.find({ status: "Active" });
  res.render("user/showallproduct", { items });
};

// get single product
exports.getsingleproduct = async (req, res) => {
  if (req.session.email) {
    const id = req.params.id;
    const email = req.session.email;
    const emailId = await signupCollection.findOne({ email: email });
    const userId = emailId._id;
    let wishdata = await wishlistCollection.findOne({ id: userId, proId: id });
    let wishdataId;
    if (wishdata) {
      wishdata.proId.forEach((data) => {
        if (data == id) {
          wishdataId = data;
        }
      });
      if (!wishdataId) {
        wishdataId = null;
      }
    }
    const item = await productcollection.findById(id);
    res.render("user/singleproduct", { item, wishdataId });
  } else {
    res.redirect("/user/home");
  }
};

// listing  items  by clicking category
exports.getcatProduct = async (req, res) => {
  if (req.session.email) {
    const name = req.params.name;
    const item = await productcollection.find({
      category: name,
      status: "Active",
    });
    res.render("user/categoryProduct", { item });
  } else {
    res.redirect("/user/singleproduct");
  }
};

// wishlist
exports.getwishlist = async (req, res) => {
  if (req.session.email) {
    const email = req.session.email;
    const userData = await signupCollection.findOne({ email: email });
    const userId = userData._id;
    const wishdata = await wishlistCollection.findOne({ id: userId });
    let getData;
    if (!wishdata) {
      res.render("user/wishlist",{getData});
    } else {
      getData = [];
      for (let i of wishdata.proId) {
        const product = await productcollection.findById(i);
        getData.push(product);
      }
      if(getData.length==0){
        getData=undefined
        res.render('user/wishlist',{getData})
      }else{
        res.render('user/wishlist',{getData})
      }
    }
    console.log(getData);
  }
};

// adding items to wishlist when clicking the icon
exports.postToWishlist = async (req, res) => {
  if (req.session.email) {
    const email = req.session.email;
    const id = req.params.id;
    try {
      const usesrData = await signupCollection.findOne({ email: email });
      if (usesrData) {
        const userId = usesrData._id;
        const findData = await wishlistCollection.findOneAndUpdate(
          { id: userId },
          { $push: { proId: id } },
          { upsert: true, new: true }
        );
        if (findData) {
          res.status(200).json({ message: "data pushed" });
        }
      } else {
        console.log("user not found");
      }
    } catch (err) {
      console.log("the error is :");
    }
  } else {
    res.status(401);
  }
};

// remove item from wishlist
exports.removeFromWishlist=async(req,res)=>{
  if(req.session.email){
    const id=req.params.id
    const email = req.session.email;
    const userData = await signupCollection.findOne({ email: email });
    const userId = userData._id;
  try{
    await wishlistCollection.findOneAndUpdate(
      {id:userId},
      {$pull:{proId:id}},
      {new:true}
    )
    res.status(200).json({message:'item removed successfully'})
  }
  catch(err){
      res.status(502).json({message:'not poped'})
  }
  }
}
