const signupCollection = require("../model/usersignupData");
const wishlistCollection = require("../model/wishlist");
const productcollection = require("../model/addproductScema");

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
    } else {
      res.redirect("/common/login");
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
  
  