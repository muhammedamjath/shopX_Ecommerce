const signupCollection = require("../model/usersignupData");
const cartcollections = require("../model/cart");
const coupenschema = require("../model/coupon");
const checoutcollections = require("../model/checkout");



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
      if (address) {
        res.render("user/checkout", { cartData, subtotal, coupon, address });
      } else {
        res.render("user/checkout", { cartData, subtotal, coupon, address: "" });
      }
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