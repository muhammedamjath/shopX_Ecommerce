const express = require("express");
const app = express();
const ejs = require("ejs");
require("dotenv").config();
const session = require("express-session");
const flash = require("connect-flash");
const port = process.env.port;
const secret = process.env.secret;
const mongoose = require("mongoose");

app.set("view engine", "ejs");
app.set("views", "views");

// session
app.use(
  session({
    secret,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(flash());

// Import all routes
const admin = require("./router/admin");
const user = require("./router/user");
const commen = require("./router/common");

// use routes
app.use("/admin", admin);
app.use("/user", user);
app.use("/", commen);

// mongoose connect
mongoose
  .connect(process.env.MONGOADDRESS)
  .then(() => {
    console.log("mongodb  connected   sidesuccessfull");
    app.listen(port, () => {
      console.log(`server started in port ${port}`);
    });
  }) 
  .catch(() => console.log("mongodb not connected"));
