const bannercollection = require("../model/banner");
const categorycollection = require("../model/categorySchema");
const productcollection = require("../model/addproductScema");
const wishlistCollection = require("../model/wishlist");
const signupCollection = require("../model/usersignupData");
const cartcollections = require("../model/cart");
const profileschema= require('../model/userprofiledata')
const upload = require("../middileware/multer");
const mongoose = require('mongoose');


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
      res.render("user/wishlist", { getData });
    } else {
      getData = [];
      for (let i of wishdata.proId) {
        const product = await productcollection.findById(i);
        getData.push(product);
      }
      if (getData.length == 0) {
        getData = undefined;
        res.render("user/wishlist", { getData });
      } else {
        res.render("user/wishlist", { getData });
      }
    }
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
exports.removeFromWishlist = async (req, res) => {
  if (req.session.email) {
    const id = req.params.id;
    const email = req.session.email;
    const userData = await signupCollection.findOne({ email: email });
    const userId = userData._id;
    try {
      await wishlistCollection.findOneAndUpdate(
        { id: userId },
        { $pull: { proId: id } },
        { new: true }
      );
      res.status(200).json({ message: "item removed successfully" });
    } catch (err) {
      res.status(502).json({ message: "not poped" });
    }
  }
};

// cart creating
exports.createcart = async (req, res) => {
  if (req.session.email) {
    const id = req.params.id;
    const email = req.session.email;

    try {
      const userData = await signupCollection.findOne({ email: email });
      if (userData) {
        const userId = userData._id;
        const checking = await cartcollections.findOne({
          userId: userId,
          "productId.id": id,
        });
        if (checking) {
          res.status(200).json({ message: "the product is already in cart" });
        } else {
          const cartCreation = await cartcollections.findOneAndUpdate(
            { userId: userId },
            { $push: { productId: { id: id } } },
            { upsert: true, new: true }
          );
          if (cartCreation) {
            res
              .status(200)
              .json({ message: "created and updeted the cart successfully" });
          } else {
            res
              .status(200)
              .json({ message: "cart document not created of this user" });
          }
        }
      } else {
        console.log("user is not found");
      }
    } catch (err) {
      console.log(err);
    }
  }
};

// cart get
exports.cartget = async (req, res) => {
  if (req.session.email) {
    let subtotal = 0;
    const email = req.session.email;
    const userData = await signupCollection.findOne({ email: email });
    const userId = userData._id;
    let cartItem = [];
    let data;
    try {
      const cartData = await cartcollections.findOne({ userId: userId });

      if (cartData) {
        data = [];
        for (let doc of cartData.productId) {
          let quantity = doc.count;
          cartItem.push(doc);
          try {
            let item = await productcollection.findById(doc.id);
            if (item) {
              subtotal += quantity * item.offerprize;
              data.push(item);
            }
          } catch {
            console.log("error while reciving product");
          }
        }
      }
      res.render("user/cart", { data, cartItem, subtotal });
    } catch (err) {
      console.log(err);
    }
    total = subtotal;
  }
};

// updating cart quantity
exports.updateCount = async (req, res) => {
  if (req.session.email) {
    const email = req.session.email;
    const userData = await signupCollection.findOne({ email: email });
    const userId = userData._id;
    const id = req.params.id;
    const quantity = req.params.quantity;
    try {
      const updatecount = await cartcollections.findOneAndUpdate(
        { userId: userId, "productId.id": id },
        { $set: { "productId.$.count": quantity } },
        { new: true }
      );
      if (updatecount) {
        res.status(200).json({});
      } else {
        res.status(502).json({ message: "quantity not updated" });
      }
    } catch (err) {
      console.log(err);
    }
  }
};

// remove item from cart
exports.delcartItem = async (req, res) => {
  if (req.session.email) {
    const id = req.params.id;
    const email = req.session.email;
    const userData = await signupCollection.findOne({ email: email });
    const userId = userData._id;
    try {
      const updatecount = await cartcollections.findOneAndUpdate(
        { userId: userId },
        { $pull: { productId: { id: id } } },
        { new: true }
      );
      if (updatecount) {
        res.status(200).json({ message: "item   deleted from cart" });
      } else {
        res.status(502).json({ message: "item  not deleted from cart" });
      }
    } catch (err) {
      console.log(err);
    }
  }
};

// getuserprofile
exports.getprofile=async(req,res)=>{
  if(req.session.email){
    const email = req.session.email;
    const userData = await signupCollection.findOne({ email: email });
    const userId = userData._id;
    try {
      const proData = await profileschema.aggregate([
        {
          $match: { id: new mongoose.Types.ObjectId(userId) }
        },
        {
          $lookup: {
            from: 'signupcollections',
            localField: 'id',
            foreignField: '_id',
            as: 'totalData'
          }
        }
      ]);
      if(proData.length==0){
        const prodata=proData[0]
        res.render('user/getprofile',{prodata:'',userData});
      }else{
        const prodata=proData[0]
        res.render('user/getprofile',{prodata,userData});

      }
      
    } catch (error) {
      console.error(error);
    }
}else{
  res.redirect('/common/login')
}
}

// edit or complete profile get page
exports.completeprofile=async(req,res)=>{
  if(req.session.email){
    const email = req.session.email;
    const userData = await signupCollection.findOne({ email: email });
    const userId = userData._id;
    try {
      const proData = await profileschema.aggregate([
        {
          $match: { id: new mongoose.Types.ObjectId(userId) }
        },
        {
          $lookup: {
            from: 'signupcollections',
            localField: 'id',
            foreignField: '_id',
            as: 'totalData'
          }
        }
      ]);
      if(proData.length==0){
        const prodata=proData[0]
        res.render('user/Editprofile',{prodata:'',});
      }else{
        const prodata=proData[0]
        res.render('user/Editprofile',{prodata});

      }
      
    } catch (error) {
      console.error(error);
    }
}else{
  res.redirect('/common/login')
}
}

// using multer2
exports.multer1 = upload.upload2.single("image"); 

// create or update profile data
exports.postprofile=async(req,res)=>{
  if(req.session.email){
    const email = req.session.email;
    const userData = await signupCollection.findOne({ email: email });
    const userId = userData._id;
    const {name,gender,mobno,dob,HouseName,StreetName,post,pincode,district,state}=req.body
    const image='images/'+req.file.filename
    try{
        const profiledata= await profileschema.findOneAndUpdate(
          {id:userId},
          {$set:{
            name:name ,
            Image:image ,
            gender: gender,
            dob: dob,
            housename: HouseName,
            Streetname: StreetName,
            post: post,
            pincode:pincode ,
            district:district ,
            state: state
          }},{upsert:true,new:true})

          if(profiledata){
            res.redirect('/user/getprofile')
          }else{
            console.log('not fount profiledata');
          }
    }
    catch(err){
      console.log(err);
    }
  }else{
    res.redirect('/common/login')
  }
}