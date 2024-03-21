const signupCollection = require("../model/usersignupData");
const cartcollections = require("../model/cart");
const productcollection = require("../model/addproductScema");

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
  
        console.log(cartData);
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
    } else {
      res.redirect("/common/login");
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
  
  