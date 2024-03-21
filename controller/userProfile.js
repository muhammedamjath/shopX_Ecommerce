const signupCollection = require("../model/usersignupData");
const profileschema = require("../model/userprofiledata");
const upload = require("../middileware/multer");
const mongoose = require("mongoose");


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