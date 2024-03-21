const categoryCollection = require("../model/categorySchema");
const additemCollection = require("../model/addproductScema");
const upload = require("../middileware/multer");

// using multer
exports.multerpost = upload.upload.array("image", 4);

// add product get
exports.getaadProduct = async (req, res) => {
  const itemdata = await categoryCollection.find();
  res.render("admin/aadproduct", { mongoAdminData, itemdata });
};

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

// delete item
exports.deleteitem = async (req, res) => {
  const id = req.params.id;

  const product = await additemCollection.findById(id);
  if (!product) {
    console.log("item not fount");
  } else {
    await additemCollection.findByIdAndDelete(id);
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
    res.redirect("/admin/showproduct");
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
