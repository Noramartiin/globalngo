const router = require("express").Router();
const UserModel = require("../models/User.model.js");
const NGOModel = require("../models/Ngo.model");
const bcrypt = require("bcryptjs");
const { render } = require("../app.js");
const { populate } = require("../models/User.model.js");

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

//SIGNIN PAGE
router.get("/signup", (req, res, next) => {
  res.render("auth/signup.hbs");
});
router.post("/signup", (req, res, next) => {
  //get data from the form
  const { name, email, password } = req.body;
  // checking if all the require inputs are completed
  if (!name || !email | !password) {
    res.render("auth/signup", { msg: "Please enter all fields" });
    return;
  }
  // validation email sintax
  let re = /\S+@\S+\.\S+/;
  if (!re.test(email)) {
    res.render("auth/signup", { msg: "Email not valid" });
  }
  // encrypting password
  let salt = bcrypt.genSaltSync(10);
  let hash = bcrypt.hashSync(password, salt);
  //check if email is already used
  UserModel.findOne({ email })
    .then((result) => {
      if (result) {
        res.render("auth/signup", {
          msg: "Email already in use, choose another one",
        });
      } else {
        //creating the user in the DB
        UserModel.create({ name, email, password: hash })
          .then((result) => {
            req.session.logedUser = result;
            res.redirect("/profile/" + result._id);
          })
          .catch((err) => {
            next(err);
          });
      }
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
  //getting data from the form
  const { email, password } = req.body;
  // finding the user in the DB
  UserModel.findOne({ email })
    .then((result) => {
      //checking if the email is in the DB
      if (result) {
        //comparing password with the encrypted password in DB
        bcrypt
          .compare(password, result.password)
          .then((matches) => {
            if (matches) {
              req.session.logedUser = result;
              res.redirect("/profile/" + result._id);
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

//SETTING COOKIES
const checkLogedInUser = (req, res, next) => {
  if (req.session.logedUser) {
    next();
  } else {
    res.redirect("/login");
  }
};

//PROFILE PAGE
router.get("/profile/:id", checkLogedInUser, (req, res, next) => {
  let id = req.params.id;
  UserModel.findById(id)
    .then((result) => {
      NGOModel.find({ owner: id })
        .then((resultngos) => {
          if (resultngos) {
            res.render("profile.hbs", { result, resultngos });
          } else {
            res.render("profile.hbs", { result });
          }
        })
        .catch((err) => {
          next(err);
        });
    })
    .catch((err) => {
      next(err);
    });
});
router.post("/profile/:id", (req, res, next) => {
  let id = req.params.id;
  const { name, email, oldPassword, newPassword } = req.body;
  UserModel.findOne({ _id: id }).then((result) => {
    bcrypt
      .compare(oldPassword, result.password)
      .then((matches) => {
        if (matches) {
          let salt = bcrypt.genSaltSync(10);
          let hash = bcrypt.hashSync(newPassword, salt);
          UserModel.findByIdAndUpdate(
            { _id: id },
            { name, email, password: hash }
          ).then(() => {
            NGOModel.find({ owner: id }).then((resultngos) => {
              res.render("profile.hbs", {
                result,
                resultngos,
                msg: "You profile has been modified",
              });
            });
          });
        } else {
          NGOModel.find({ owner: id }).then((resultngos) => {
            res.render("profile.hbs", {
              result,
              resultngos,
              msg: "You password does not match",
            });
          });
        }
      })
      .catch((err) => {
        next(err);
      });
  });
});

//CREATE NEW NGO
router.get("/new-ngo/:id", checkLogedInUser, (req, res, next) => {
  let id = req.params.id;
  UserModel.findById(id)
    .then((result) => {
      res.render("new-ngo.hbs", { result });
    })
    .catch((err) => {
      next(err);
    });
});

router.post("/new-ngo/:id", (req, res, next) => {
  let id = req.params.id;
  const { name, information, images, url, key } = req.body;
  NGOModel.create({ name, information, images, url, key, owner: id })
    .then(() => {
      res.redirect("/profile/" + id);
    })
    .catch((err) => {
      next(err);
    });
});

//EDIT PAGE
router.get("/new-ngo/:id/edit", (req, res, next) => {
  let id = req.params.id;
  // const { name, information, images, url, key } = req.body;
  NGOModel.findById(id)
    .then((result) => {
      res.render("edit-ngo.hbs", { result });
    })
    .catch((error) => {
      next(error);
    });
});

router.post("/new-ngo/:id/edit", (req, res, next) => {
  let id = req.params.id;
  const { name, information, images, url, key } = req.body;
  NGOModel.findByIdAndUpdate(id)
    .then(() => {
      res.redirect("/profile/" + id);
    })
    .catch((error) => {
      next(error);
    });
});

router.post("/new-ngo/:id/delete", (req, res, next) => {
  let id = req.params.id;

  NGOModel.findByIdAndDelete(id)
    .then(() => {
      res.redirect("/profile/" + id);
    })
    .catch((error) => {
      next(error);
    });
});

//PROFILE PAGE
router.get("/profile/:id", checkLogedInUser, (req, res, next) => {
  let id = req.params.id;
  UserModel.findById(id)
    .then((profileInfo) => {
      NGOModel.find({ owner: id })
        .then((result) => {
          res.render("profile.hbs", { profileInfo, result });
        })
        .catch((err) => {
          next(err);
        });
    })
    .catch((err) => {
      next(err);
    });
});

// ONGS PAGE
router.get("/ngos", (req, res, next) => {
  NGOModel.find()
    .then((data) => {
      res.render("ngos.hbs", { data });
    })
    .catch((error) => {
      next(error);
    });
});

// ONG INFO PAGE
router.get("/ngo-info/:id", (req, res, next) => {
  let id = req.params.id;
  NGOModel.findById({ _id: id })
    .then((result) => {
      res.render("ngo-info.hbs", { result });
    })
    .catch((err) => {
      next(err);
    });
});

//DONATE
router.get("/donate", (req, res, next) => {
  res.render("donate.hbs");
});

// LOG OUT PAGE
router.get("/logout", (req, res, next) => {
  req.session.destroy();
  res.redirect("/");
});

module.exports = router;
