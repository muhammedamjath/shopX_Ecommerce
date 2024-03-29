const signupCollection = require("../model/usersignupData");
const otpjs = require("../public/js/otp");
const bcrypt = require("bcrypt");const bannercollection = require("../model/banner");
const categorycollection = require("../model/categorySchema");
const productcollection = require("../model/addproductScema");

// rejex
const emailRejex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
const passwordRejex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// common home get
exports.commonHome =async (req, res) => {
  const banner = await bannercollection.find();
  const categories = await categorycollection.find();
  const product = await productcollection
    .find({ status: "Active" })
    .limit(10);
  res.render("user/home", { banner, categories, product });
};

// login get
exports.loginget = (req, res) => {
  res.render("common/login");
};

// signup get
exports.signupget = (req, res) => {
  res.render("common/signup");
};

// signup post
let randomeOtp;
let sentEmail;
let signupData;
let reqBody;
exports.signupPost = async (req, res) => {
  reqBody = req.body;
  sentEmail = req.body.email;
  randomeOtp = otpjs.generateOTP();
  const checkEmail = await signupCollection.findOne({ email: sentEmail });

  if (checkEmail) {
    res.status(400).send("this email is already used");
  } else {
    if (
      !passwordRejex.test(req.body.password) ||
      !emailRejex.test(req.body.email)
    ) {
      res.status(400).send("invalid email or password");
    } else {
      const hashPas = await bcrypt.hash(req.body.password, 10);
      signupData = new signupCollection({
        username: req.body.name,
        mobno: req.body.number,
        password: hashPas,
        email: req.body.email,
      });
      otpjs.sendOTPEmail(sentEmail, randomeOtp);
      console.log("otp sent to " + sentEmail);
      res.redirect("/otp");
    }
  }
};

//  get otp
exports.getOtp = (req, res) => {
  res.render("common/otp", { reqBody });
};

// otp post
exports.otpPost = async (req, res) => {
  let OTPobj = req.body;
  let otpStr = "";
  for (let x in OTPobj) {
    otpStr += OTPobj[x];
  }
  try {
    if (otpStr === randomeOtp) {
      await signupData.save();
      console.log("data added to mongodb successfully");
      res.redirect("/common/login");
    } else {
      console.log("otp is not valid");
      res.redirect("/otpInvalid");
    }
  } catch (error) {
    console.log(error);
  } 
};

// otpInvalid get
exports.otpInvalid = (req, res) => {
  res.render("common/otpInvalid");
};

// login post
exports.loginpost = async (req, res) => {
  const mongoData = await signupCollection.findOne({ email: req.body.email });

  if (req.body.email == "" || req.body.password == "") {
    res.render("common/login");
  }
  if (mongoData.status === "Blocked") {
    req.flash('error', 'Your account is blocked')
    res.redirect('/common/login')
  } else {
    const mongoPass = await bcrypt.compare(
      req.body.password,
      mongoData.password
    );
    if (mongoPass) {
      req.session.email=req.body.email
      if(req.session.email){
        res.redirect("/user/home");
      }else {
          res.redirect("/common/login");
      }
    } 
  }
};
