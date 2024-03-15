const bannercollection = require("../model/banner");
const categorycollection = require("../model/categorySchema");
const productcollection = require("../model/addproductScema");
const wishlistCollection = require("../model/wishlist");
const signupCollection = require("../model/usersignupData");
const cartcollections = require("../model/cart");
const profileschema = require("../model/userprofiledata");
const upload = require("../middileware/multer");
const mongoose = require("mongoose");
const coupenschema = require("../model/coupon");
const checoutcollections = require("../model/checkout");
const addressCollection = require("../model/adress");
const Razorpay = require("razorpay");
const additemCollection = require("../model/addproductScema");

// Razorpay
const razorId = process.env.RAZORPAY_ID_KEY;
const razorSecret = process.env.RAZORPAY_SECRET_KEY;
const instance = new Razorpay({
  key_id: razorId,
  key_secret: razorSecret,
});

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
      if (data == undefined || data.length == 0) {
        data = undefined;
      }
      res.render("user/cart", { data, cartItem, subtotal, cartData });
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
exports.getprofile = async (req, res) => {
  if (req.session.email) {
    const email = req.session.email;
    const userData = await signupCollection.findOne({ email: email });
    const userId = userData._id;
    try {
      const proData = await profileschema.aggregate([
        {
          $match: { id: new mongoose.Types.ObjectId(userId) },
        },
        {
          $lookup: {
            from: "signupcollections",
            localField: "id",
            foreignField: "_id",
            as: "totalData",
          },
        },
      ]);
      if (proData.length == 0) {
        const prodata = proData[0];
        res.render("user/getprofile", { prodata: "", userData });
      } else {
        const prodata = proData[0];
        res.render("user/getprofile", { prodata, userData });
      }
    } catch (error) {
      console.error(error);
    }
  } else {
    res.redirect("/common/login");
  }
};

// edit or complete profile get page
exports.completeprofile = async (req, res) => {
  if (req.session.email) {
    const email = req.session.email;
    const userData = await signupCollection.findOne({ email: email });
    const userId = userData._id;
    try {
      const proData = await profileschema.aggregate([
        {
          $match: { id: new mongoose.Types.ObjectId(userId) },
        },
        {
          $lookup: {
            from: "signupcollections",
            localField: "id",
            foreignField: "_id",
            as: "totalData",
          },
        },
      ]);
      if (proData.length == 0) {
        res.render("user/Editprofile", { prodata: "" });
      } else {
        const prodata = proData[0];
        res.render("user/Editprofile", { prodata });
      }
    } catch (error) {
      console.error(error);
    }
  } else {
    res.redirect("/common/login");
  }
};

// using multer2
exports.multer1 = upload.upload2.single("image");

// create or update profile data
exports.postprofile = async (req, res) => {
  if (req.session.email) {
    const email = req.session.email;
    const userData = await signupCollection.findOne({ email: email });
    const userId = userData._id;
    const {
      name,
      gender,
      dob,
      HouseName,
      StreetName,
      post,
      pincode,
      district,
      state,
    } = req.body;
    const image = "images/" + req.file.filename;
    try {
      const profiledata = await profileschema.findOneAndUpdate(
        { id: userId },
        {
          $set: {
            name: name,
            Image: image,
            gender: gender,
            dob: dob,
            housename: HouseName,
            Streetname: StreetName,
            post: post,
            pincode: pincode,
            district: district,
            state: state,
          },
        },
        { upsert: true, new: true }
      );

      if (profiledata) {
        res.redirect("/user/getprofile");
      } else {
        console.log("not fount profiledata");
      }
    } catch (err) {
      console.log(err);
    }
  } else {
    res.redirect("/common/login");
  }
};

// checkout get
exports.checkoutget = async (req, res) => {
  if (req.session.email) {
    const id = req.params.id;
    const userData = await signupCollection.findOne({
      email: req.session.email,
    });
    const cartData = await cartcollections
      .findById(id)
      .populate("productId.id");
    const address = await profileschema.findOne({ id: userData._id });
    let subtotal = 0;
    cartData.productId.forEach((data) => {
      subtotal += data.id.offerprize * data.count;
    });
    const coupon = await coupenschema.findOne({
      minamount: { $lte: subtotal },
      maxamount: { $gte: subtotal },
    });
    res.render("user/checkout", { cartData, subtotal, coupon, address });
  } else {
    res.render("common/login");
  }
};

// applaying coupon
exports.applycoupon = async (req, res) => {
  const id = req.params.id;
  const coupon = await coupenschema.findById(id);
  if (coupon) {
    const discAmount = coupon.discamount;
    const CId = coupon._id;
    res.status(200).json({ data: discAmount, CId: CId });
  } else {
    res.status(401).json({ message: "something error " });
  }
};

// checkout post
exports.checkoutPost = async (req, res) => {
  if (req.session.email) {
    const {
      name,
      mobno,
      email,
      house,
      pincode,
      district,
      state,
      peyment,
      couponid,
    } = req.body;
    const user = await signupCollection.findOne({ email: req.session.email });
    const cartData = await cartcollections
      .findOne({ userId: user._id })
      .populate("productId.id");
    if (cartData) {
      let subtotal = 0;
      let total = 0;
      let proIds = [];
      let discAmount = 0;
      let shippingamount = subtotal < 1000 ? 50 : "Free";
      cartData.productId.forEach((data) => {
        let obj = {
          id: data.id._id,
          offerprice: data.id.offerprize,
          color: data.id.color,
          count: data.count,
        };
        proIds.push(obj);
        subtotal += data.id.offerprize * data.count;
      });

      if (subtotal < 1000) {
        total = subtotal + 50;
      } else {
        total = subtotal;
      }

      const orderDetailes = {
        house: house,
        product: proIds,
        pincode: pincode,
        district: district,
        state: state,
        name: name,
        mobno: mobno,
        email: email,
        peymentMethord: peyment,
        subtotal: subtotal,
        shippingCharge: shippingamount,
        discount: discAmount,
        totalAmount: total,
      };

      if (req.body.couponid == "") {
        const datasaving = await checoutcollections.findOneAndUpdate(
          { userId: user._id },
          {
            $push: {
              orderDetailes: orderDetailes,
            },
          },
          { upsert: true, new: true }
        );
        if (datasaving) {
          if (req.body.peyment == "cod") {
            res.redirect("/user/ordercomplete/hai");
          } else {
            res.redirect("/user/peyment");
          }
        }
      } else {
        const couponcheck = await coupenschema.findById(couponid);
        orderDetailes.discount = couponcheck.discamount;
        orderDetailes.couponId = couponid;
        orderDetailes.totalAmount = subtotal - couponcheck.discamount;
        orderDetailes.shippingCharge = subtotal >= 1000 ? "Free" : 50;

        const datasaving = await checoutcollections.findOneAndUpdate(
          { userId: user._id },
          {
            $push: {
              orderDetailes: orderDetailes,
            },
          },
          { upsert: true, new: true }
        );
        if (datasaving) {
          if (req.body.peyment == "cod") {
            res.redirect("/user/ordercomplete/hai");
          } else {
            res.redirect("/user/peyment");
          }
        }
      }
    }
  }
};

// peyment get
exports.peymentget = async (req, res) => {
  if (req.session.email) {
    const user = await signupCollection.findOne({ email: req.session.email });
    const data = await checoutcollections.findOne({ userId: user._id });
    if (data) {
      const checkData = data.orderDetailes[data.orderDetailes.length - 1];
      const amount = checkData.totalAmount;
      res.render("user/peyment", { amount });
    }
  } else {
    res.render("common/login");
  }
};

// razorpay peyment post
exports.peymentppost = async (req, res) => {
  if (req.session.email) {
    try {
      const userData = await signupCollection.findOne({
        email: req.session.email,
      });
      const checkoutdata = await checoutcollections.findOne({
        userId: userData._id,
      });

      const checkorder =
        checkoutdata.orderDetailes[checkoutdata.orderDetailes.length - 1];
      const amount = checkorder.totalAmount;
      const currency = "INR";
      const receipt = userData.email;

      const data = {
        key: razorId,
        contact: userData.mobno,
        name: userData.username,
        email: userData.email,
      };
      const order = await instance.orders.create({
        amount: amount * 100,
        currency,
        receipt,
      });

      res.json({ order, data });
    } catch (err) {
      console.log("error when post createOrder", err.message);
    }
  } else {
    res.redirect("/common/login");
  }
};

// getting order complete page after make upi or cod peyment
exports.completeOrderGet = async (req, res) => {
  if (req.session.email) {
    const methord = req.params.data;
    const userData = await signupCollection.findOne({
      email: req.session.email,
    });
    const checkData = await checoutcollections.findOne({
      userId: userData._id,
    });
    const lastorder = checkData.orderDetailes.length - 1;
    const lastorderObj =
      checkData.orderDetailes[checkData.orderDetailes.length - 1];
    const deletecart = await cartcollections.findOneAndDelete({
      userId: userData._id,
    });
    if (methord == "upi") {
      const val = "Success";
      const updateobj = await checoutcollections.findOneAndUpdate(
        { userId: userData._id },
        { $set: { [`orderDetailes.${lastorder}.peymentStatus`]: val } },
        { new: true }
      );
    }
    res.render("user/ordercomplete");
  }
};

// orderhistory get
exports.orderHistoryGet = async (req, res) => {
  if (req.session.email) {
    const userData = await signupCollection.findOne({
      email: req.session.email,
    });
    const checkData = await checoutcollections.findOne({
      userId: userData._id,
    });
    if(checkData){
      const data = checkData.orderDetailes;
      res.render("user/orderslist", { data });
    }else{
      res.render("user/orderslist", { data:null });
    }
  }
};

// single order gistory get
exports.singleHistoryGet = async (req, res) => {
  if (req.session.email) {
    const id = req.params.id;
    const user = await signupCollection.findOne({ email: req.session.email });
    const checkdata = await checoutcollections.findOne({ userId: user._id });
    const obj = checkdata.orderDetailes.find((data) => data._id == id);

    // product find
    let product = [];
    for (let i of obj.product) {
      let productDetailes = {};
      let data = await additemCollection.findById(i.id);
      productDetailes.name = data.name;
      productDetailes.image = data.image[0];
      productDetailes.balence = i;
      product.push(productDetailes);
    }

    // date and time  convertion
    const date = new Date(obj.createdAt);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");
    const newdate = `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;

    res.render("user/singlehistory", { obj, newdate, product });
  }
};

// cancell the order
exports.cancellorder=async(req,res)=>{
  if(req.session.email){
    const id = req.params.id;
    const update='cancelld'
    const user= await signupCollection.findOne({email:req.session.email})
    const checkData= await checoutcollections.findOneAndUpdate(
      {userId:user._id,"orderDetailes._id":id},
      {$set:{"orderDetailes.$.orderSatatus":update}}
      )
      if(checkData){
        res.status(200).json({message:"cancelled"})
      }
  }
  
}