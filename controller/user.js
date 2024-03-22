const bannercollection = require("../model/banner");
const categorycollection = require("../model/categorySchema");
const productcollection = require("../model/addproductScema");
const wishlistCollection = require("../model/wishlist");
const signupCollection = require("../model/usersignupData");
const cartcollections = require("../model/cart");
const mongoose = require("mongoose");
const checoutcollections = require("../model/checkout");
const Razorpay = require("razorpay");
const additemCollection = require("../model/addproductScema");
const reviewschema = require("../model/review");

// Razorpay
const razorId = process.env.RAZORPAY_ID_KEY;
const razorSecret = process.env.RAZORPAY_SECRET_KEY;
const instance = new Razorpay({
  key_id: razorId,
  key_secret: razorSecret,
});

// user home
exports.homeget = async (req, res) => {
  const banner = await bannercollection.find();
  const categories = await categorycollection.find();
  const product = await productcollection.find({stock:{$gt:0},status: "Active" }).limit(10);
  res.render("user/home", { banner, categories, product });
};

// showing all product
exports.getallproduct = async (req, res) => {
  let items;
  if (req.query.search) {
    const search = req.query.search;
    items = await productcollection.find({
      stock: { $gt: 0 },
      status: { $ne: "Blocked" },
      name: { $regex: search, $options: "i" },
    });
  } else if (req.query.sort) {
    const sort = req.query.sort;
    if (sort === "low to high") {
      items = await productcollection
        .find({ stock: { $gt: 0 }, status: { $ne: "Blocked" } })
        .sort({ offerprize: 1 });
    } else if (sort === "high to low") {
      items = await productcollection
        .find({ stock: { $gt: 0 }, status: { $ne: "Blocked" } })
        .sort({ offerprize: -1 });
    }
  } else {
    items = await productcollection.find({stock:{$gt:0},status: "Active" });
  }
  res.render("user/showallproduct", { items });
};

// get single product
exports.getsingleproduct = async (req, res) => {
  const id = req.params.id;
  let wishdataId;
  const item = await productcollection.findById(id);
  const reviewData = await reviewschema.find({
    productId: new mongoose.Types.ObjectId(id),
  });
  let reviews = [];
  for (let i of reviewData) {
    const userId = await signupCollection.findOne({
      _id: new mongoose.Types.ObjectId(i.userId),
    });
    const username = userId.username;
    let obj = { username: username, content: i.review, starcount: i.starcount };
    reviews.push(obj);
  }

  if (req.session.email) {
    const email = req.session.email;
    const emailId = await signupCollection.findOne({ email: email });
    const userId = emailId._id;
    let wishdata = await wishlistCollection.findOne({ id: userId, proId: id });
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
  }
  res.render("user/singleproduct", { item, wishdataId, reviews });
};

// listing  items  by clicking category
exports.getcatProduct = async (req, res) => {
  const name = req.params.name;
  const items = await productcollection.find({
    category: name,
    status: "Active",
  });
  res.render("user/showallproduct", { items });
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

// getting order complete page after make upi peyment
exports.completeOrderGet = async (req, res) => {
  if (req.session.email) {
    const methord = req.params.data;
    const userData = await signupCollection.findOne({
      email: req.session.email,
    });
    const checkData = await checoutcollections.findOne({
      userId: userData._id,
    });
    let proIds = [];

    const cartData = await cartcollections
      .findOne({ userId: userData._id })
      .populate("productId.id");

    if (cartData) {
      cartData.productId.forEach((data) => {
        let obj = {
          id: data.id._id,
          offerprice: data.id.offerprize,
          color: data.id.color,
          count: data.count,
        };
        proIds.push(obj);
      });
    }

    const lastorder = checkData.orderDetailes.length - 1;
    const lastorderObj =
      checkData.orderDetailes[checkData.orderDetailes.length - 1];
    const deletecart = await cartcollections.findOneAndDelete({
      userId: userData._id,
    });
    if (methord == "upi") {
      const val = "Success";
      for (let i of proIds) {
        const update = await additemCollection.findOneAndUpdate(
          { _id: new mongoose.Types.ObjectId(i.id) },
          { $inc: { stock: -i.count } },
          { new: true }
        );
      }
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
    if (checkData) {
      const data = checkData.orderDetailes;
      res.render("user/orderslist", { data });
    } else {
      res.render("user/orderslist", { data: null });
    }
  } else {
    res.render("common/login");
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
exports.cancellorder = async (req, res) => {
  if (req.session.email) {
    const id = req.params.id;
    const update = "cancelled";
    const user = await signupCollection.findOne({ email: req.session.email });
    const checkData = await checoutcollections.findOneAndUpdate(
      { userId: user._id, "orderDetailes._id": id },
      { $set: { "orderDetailes.$.orderSatatus": update } }
    );
    if (checkData) {
      res.status(200).json({ message: "cancelled" });
    }
  }
};

// logout
exports.logout = (req, res) => {
  req.session.destroy();
  res.redirect("/user/home");
};

// reviw post
exports.review = async (req, res) => {
  if (req.session.email) {
    const star = req.query.starcount;
    const textcontent = req.query.content;
    const proId = req.query.proId;
    const user = await signupCollection.findOne({ email: req.session.email });
    const userId = user._id;
    const checkdata = await checoutcollections.findOne({ userId: userId });
    let orderStatus;

    try {
      if (checkdata) {
        let proIdExists = false;
        checkdata.orderDetailes.forEach((order) => {
          order.product.forEach((product) => {
            if (product.id.toString() === proId) {
              orderStatus = order.orderSatatus;
              proIdExists = true;
            }
          });
        });
        if (proIdExists === false) {
          res
            .status(200)
            .json({ message: "pls purchase this product for post review" });
        } else {
          const findPreviewsReview = await reviewschema.findOne({
            userId: userId,
            productId: proId,
          });
          if (findPreviewsReview) {
            res
              .status(200)
              .json({ message: "you already reviewd this product" });
          } else {
            if (orderStatus == "deliverd") {
              const reviewCreate = new reviewschema({
                productId: proId,
                userId: userId,
                review: textcontent,
                starcount: star,
              });
              await reviewCreate.save();
              if (reviewCreate) {
                res.status(200).json({ message: "created successfull" });
              }
            } else {
              res.status(200).json({
                message: "you can review this product after deliverd",
              });
            }
          }
        }
      } else {
        res
          .status(200)
          .json({ message: "pls purchase this product for post review" });
      }
    } catch (err) {
      console.log(err);
    }
  } else {
    res.status(200).json({ message: "pls login" });
  }
};
