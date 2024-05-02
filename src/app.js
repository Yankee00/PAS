const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const express = require("express");
const app = express();
const path = require("path");
const hbs = require("hbs");
const multer = require("multer");

require("./db/conn");
const Register = require("./models/registerss");
const OtpkaObjecthai = require("./models/otpss");
const add_pets = require("./models/add_pets");
const { reverse } = require("dns");

const port = process.env.PORT || 3000;

const static_path = path.join(__dirname, "../public");
const template_path = path.join(__dirname, "../templates/views");
const partials_path = path.join(__dirname, "../templates/partials");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(static_path));

app.set("view engine", "hbs");
app.set("views", template_path);
hbs.registerPartials(partials_path);

// Index
app.get("/", async (req, res) => {
  const dataOfPets = await add_pets.find();
  res.status(201).render("index", { dataOfPets: dataOfPets });
});

//onetimmepassword
app.get("/Otppp", async (req, res) => {
  res.status(201).render("Otppp");
});

// petDetails___
app.get("/petDetails___", async (req, res) => {
  res.status(201).render("petDetails___");
});

// Verification
app.get("/verification", async (req, res) => {
  res.status(201).render("verification");
});

// Verification
app.get("/ResetPassword", async (req, res) => {
  res.status(201).render("ResetPassword");
});

//Forget Password
app.get("/ForgetPassword", async (req, res) => {
  res.status(201).render("ForgetPassword");
});

// Index/HomePage
app.get("/index", (req, res) => {
  const dataOfPets = add_pets.find();
  res.status(201).render("index", { dataOfPets: dataOfPets });
});

// Login
app.get("/login", (req, res) => {
  res.render("login");
});

// Register
app.get("/register", (req, res) => {
  res.render("register");
});

// ALindex
app.get("/ALindex", async (req, res) => {
  const dataOfPets = await add_pets.find();
  res.status(201).render("ALindex", { dataOfPets: dataOfPets });
});

// Add_pets
app.get("/add_pets", (req, res) => {
  res.render("add_pets");
});

// Cats
app.get("/cats", async (req, res) => {
  const dataOfPets = await add_pets.find();
  res.status(201).render("cats", { dataOfPets: dataOfPets });
});

// Dogs
app.get("/dogs", async (req, res) => {
  const dataOfPets = await add_pets.find();
  res.status(201).render("dogs", { dataOfPets: dataOfPets });
});

app.post("/register", async (req, res) => {
  try {
    const password = req.body.password;
    const cpassword = req.body.confirmpassword;

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,21}$/;

    if (password === cpassword && passwordRegex.test(password)) {
      const registerEmployee = new Register({
        email: req.body.email,
        username: req.body.username,
        password: password,
      });

      const registered = await registerEmployee.save();

      res.render("login");
    } else if (password !== cpassword) {
      res.render("register", {
        message: "both password and con password should match",
      });
    } else {
      res.render("register", {
        message:
          "Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and be at least 8 characters long.",
      });
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

app.post("/login", async (req, res) => {
  try {
    const username = req.body.username;
    const password = req.body.password;

    const usernamekavariable = await Register.findOne({ username: username });
    console.log(req.body.username);
    if (usernamekavariable.password === password) {
      if (usernamekavariable.verification === true) {
        res.redirect("/ALindex");
      } else {
        res.render("login", { message: "please verify the email first" });
      }
    } else {
      res.render("login", { message: "invalid login credentials" });
    }
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

const OTP = (generateSixDigitCode = () => {
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += Math.floor(Math.random() * 10);
  }
  return code;
});

const sendemail = async (username, email, id) => {
  try {
    const nodemailer = require("nodemailer");
    const jwt = require("jsonwebtoken");

    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      auth: {
        user: "OurPets2085@gmail.com",
        pass: "flblzcgfbzqvewpl",
      },
    });

    const token = jwt.sign(
      {
        data: "Token Data",
      },
      "ourSecretKey",
      { expiresIn: "10m" }
    );
    const OTp = OTP();
    try {
      const OTPO = new OtpkaObjecthai({
        email: email,
        otp: OTp,
      });

      const Otp_s_obje = await OTPO.save();
    } catch (error) {
      console.log(error);
    }

    const mailConfigurations = {
      from: "OurPets2085@gmail.com",

      to: email,
      subject: "Email Verification",

      text: `Hi! There, You have recently visited 
           our website and entered your email.
           Please follow the given link to verify your email
           ${OTp}
           Thanks`,
    };
    console.log("Email Sent Successfully");

    transporter.sendMail(mailConfigurations, function (error, info) {
      if (error) throw Error(error);
      console.log("Email Sent Successfully");
      console.log(info);
    });
  } catch (EmmaWatson) {
    console.log(EmmaWatson);
  }
};

cloudinary.config({
  cloud_name: "dsa0uv14x",
  api_key: "967195247195846",
  api_secret: "sCdRwN9uM1BLom4mh-HxHpIORd8",
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  folder: "Pets",
  allowedFormats: ["img", "jpg", "jpeg", "png"],
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

app.post("/add_pets", upload.single("image"), async (req, res) => {
  try {
    const image = req.file;

    const result = await cloudinary.uploader.upload(image.path);

    const imageUrl = result.secure_url;
    const add_petss = new add_pets({
      username: req.body.username,
      phone: req.body.phone,
      petname: req.body.petname,
      petage: req.body.petage,
      vaccination: req.body.vaccination,
      unit_day_or_month_or_year: req.body.unit_day_or_month_or_year,
      breed: req.body.breed,
      pettype_dog_or_cat: req.body.pettype_dog_or_cat,
      image: req.body.image,
      what: req.body.what,
      pettype_rescued_or_puschase: req.body.pettype_rescued_or_puschase,
      city: req.body.city,
      colour: req.body.colour,
      state: req.body.state,
      gender: req.body.gender,
      description: req.body.description,
      image:imageUrl,
    });

    const dataOfPets = await add_pets.find();
    const add_petswalatempvariable = await add_petss.save();
    res.redirect("/ALindex");
  } catch (error) {
    res.status(400).send(error);
  }
});

app.listen(port, () => {
  console.log("Hello from childrens");
});

app.post("/verification", async (req, res) => {
  try {
    const verificationSEmail = req.body.verificationSEmail;

    const email = await Register.findOne({
      email: verificationSEmail,
    });

    if (email) {
      sendemail(email.username, verificationSEmail, email._id);
      res.render("Otppp", { message: email.email });
    } else {
      res.render("verification", { message: "User is not registered" });
    }
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

app.post("/ForgetPassword", async (req, res) => {
  try {
    const ForgetPasswordo = req.body.ForgetPasswordo;

    const email = await Register.findOne({
      email: ForgetPasswordo,
    });
    if (email) {
      sendemail(email.username, ForgetPasswordo, email._id);
      res.render("OtpppforforgetP", { message: email.email });
    } else {
      res.render("ForgetPassword", { message: "User is not registered" });
    }
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

app.post("/ResetPassword", async (req, res) => {
  try {
    const password = req.body.password;
    const cpassword = req.body.confirmpassword;
    const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,21}$/;
    
    if (password === cpassword && passwordRegex.test(password)) {
      const otpverifynowupdateindatabase = await Register.findOneAndUpdate(
        { email: req.body.message },
        { $set: { password: req.body.password } }
        );
        console.log(req.body.message);
        res.render("login");
        res.redirect("/login");
      } else if (password !== cpassword) {
      res.render("ResetPassword", {
        display_message: "both password and con password should match",
      });
    } else {
      res.render("ResetPassword", {
        display_message:
          "Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and be at least 8 characters long.",
      });
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

app.post("/OtpppforforgetP", async (req, res) => {
  const otpkaemail = await OtpkaObjecthai.findOne({ email: req.body.message }).sort({ _id: -1 });
  console.log(req.body.otp_____);
  console.log(otpkaemail.otp);
  
  if (otpkaemail && otpkaemail.otp === req.body.otp_____) {
    res.render("ResetPassword", { message: req.body.message });
  } else {
    res.render("OtpppforforgetP", { incorrett: "incorrect", message: req.body.message });
  }
});

app.post("/otp", async (req, res) => {
  const otpkaemail = await OtpkaObjecthai.findOne({ email: req.body.message }).sort({ _id: -1 });
  if (otpkaemail.otp === req.body.otp_____) {
    const otpverifynowupdateindatabase = await Register.findOneAndUpdate(
      { email: req.body.message },
      { $set: { verification: true } }
    );
    res.redirect("/login");
  } else {
    res.render("Otppp", { incorrett: "incorrect", message: req.body.message });
  }
});