const express = require("express");
const path = require("path");
const fs = require("fs");
require("./db/connect");
const mongoose = require("mongoose");
const User = require("./models/user");
var session = require("express-session");
const ejs = require("ejs");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 8000;
const multer = require("multer");

//set ejs

const files = path.join(__dirname, "views");
app.set("view engine", "ejs");
app.set("views", files);
<<<<<<< HEAD
app.use(express.static("public"));
=======
mongoose.set("strictQuery",true)
>>>>>>> 70c76ee84700a21ea5c95854bc679c7b862c74ff
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const { throws } = require("assert");

//session
app.use(
  session({
    secret: "imrahul",
    resave: false,
    saveUninitialized: true,
    // cookie: { maxAge: 3000 }
  })
);

// //storing session
app.use((req, res, next) => {
  res.locals.message = req.session.message;
  delete req.session.message;
  next();
});
app.use(express.static("uploads"));

app.get("/contact", (req, res) => {
  res.render("contact");
});
app.get("/about", (req, res) => {
  res.render("about");
});

//upload images

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "/public/uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage }).single("image");
//create a user

app.get("/add", (req, res) => {
  res.render("add");
});

app.post("/add", upload, async (req, res) => {
  try {
    const email = req.body.email;
    const Register = new User({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      image: req.file.filename,
    });
    const data = await Register.save();
    console.log(data);
    // res.send(data)
    req.session.message = {
      type: "success",
      message: "User add successfully",
      // maxAge: 3000
    };
    //if we use render alert not show use only below
    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
});

//display data on screen
app.get("/", async (req, res) => {
  try {
    //search

    // var search=" "
    // if(req.query.search) {
    //   search=req.query.search
    // }
    //Pagination
    // var page=1
    // if(req.query.page) {
    //   page=req.query.page
    //   }

    //  const limit=3;

    // search=req.query.search || ""
    // const useSearch=await User.find({$or:[
    //   {name:{$regex:".*"+search+".*",$options:"i"}},
    //   {email:{$regex:".*"+search+".*",$options:"i"}},
    //   {phone:{$regex:".*"+search+".*",$options:"i"}}
    // ]})
    // .limit(limit * 1).skip((page-1)*limit).exec()

    // const count=await User.find({$or:[
    //   {name:{$regex:".*"+search+".*",$options:"i"}},
    //   {email:{$regex:".*"+search+".*",$options:"i"}},
    //   {phone:{$regex:".*"+search+".*",$options:"i"}}
    // ]}).countDocuments();

    const users = await User.find();

    res.render("homess", {
      users: users,
    });
    // totalpages:Math.ceil(count/limit),
    // currentPage:page,
    // next:page+1,
    // previous:page-1,
  } catch (error) {
    console.log(error);
  }
});

//edit a user
app.get("/edit/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById({ _id: id });
    console.log(user);
    res.render("edit", { user: user });
  } catch (error) {
    console.log(error);
  }
});

// update
app.post("/update/:id", upload, async (req, res) => {
  try {
    const id = req.params.id;
    let new_image = " ";
    if (req.file) {
      new_image = req.file.filename;
      const filename = fs.unlink("./public/uploads" + req.body.old_image);
    } else {
      new_image = req.body.old_image;
    }
    const upd = await User.findByIdAndUpdate(
      { _id: id },
      {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        image: new_image,
      }
    );
    req.session.message = {
      type: "success",
      message: "User Updated successfully",
    };
    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
});

//delete photo
app.get("/delete/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const Deletef = await User.deleteOne({ _id: id });
    // function(err,result){

    //   if (result.image !=" ") {
    //     const removed= fs.unlinkSync('./uploads/' + result.image)

    //   }
    req.session.message = {
      type: "info",
      message: "User Deleted successfully",
    };
    res.redirect("/");
    // }
  } catch (error) {
    console.log(error);
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`);
});
