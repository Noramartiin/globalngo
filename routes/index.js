const router = require("express").Router();
const UserModel = require("../models/User.model.js");
const NGOModel = require("../models/Ngo.model.js");
const bcrypt = require("bcryptjs");
const { render } = require("../app.js");
// const stripe = require("stripe");

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

//SIGNIN PAGE
router.get("/signup", (req, res, next) => {
  res.render("auth/signup.hbs");
});
router.post("/signup", (req, res, next) => {
  const { name, email, password } = req.body;
  if (!name || !email | !password) {
    res.render("auth/signup", { msg: "Please enter all fields" });
    return;
  }
  let re = /\S+@\S+\.\S+/;
  if (!re.test(email)) {
    res.render("auth/signup", { msg: "Email not valid" });
  }
  let salt = bcrypt.genSaltSync(10);
  let hash = bcrypt.hashSync(password, salt);
  UserModel.create({ name, email, password: hash })
    .then(() => {
      res.redirect("/profile");
    })
    .catch((err) => {
      next(err);
    });
});

//LOG IN PAGE
router.get("/login", (req, res, next) => {
  res.render("auth/login.hbs");
});
router.post("/login", (req, res, next) => {
  const { email, password } = req.body;
  UserModel.findOne({ email })
    .then((result) => {
      if (result) {
        bcrypt
          .compare(password, result.password)
          .then((matches) => {
            if (matches) {
              req.session.logedUser = result;
              res.redirect("/profile");
            } else {
              res.render("auth/login.hbs", {
                msg: "Password dont match, try again",
              });
            }
          })
          .catch((err) => {
            next(err);
          });
      } else {
        res.render("login.hbs", { msg: "Email does not exist" });
      }
    })
    .catch((err) => {
      next(err);
    });
});

const checkLogedInUser = (req, res, next) => {
  if (req.session.logedUser) {
    next();
  } else {
    res.redirect("/login");
  }
};

//PROFILE PAGE
router.get("/profile", checkLogedInUser, (req, res, next) => {
  res.render("profile.hbs");
});

// ONGS
router.get("/ngos", (req, res, next) => {
  NGOModel.find()
    .then((data) => {
      res.render("ngos.hbs", { data });
    })
    .catch((error) => {
      next(error);
    });
});

//DONATE
router.get("/donate", (req, res, next) => {
  res.render("donate.hbs");
});

//STRIPE
// stripe.customers.create({
//     email: "customer@example.com",
//   })
//   .then((customer) => console.log(customer.id))
//   .catch((error) => console.error(error));

router.get("/logout", (req, res, next) => {
  req.session.destroy();
  res.redirect("/");
});

module.exports = router;
