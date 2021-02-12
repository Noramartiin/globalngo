const router = require("express").Router();
const UserModel = require("../models/User.model.js");
const bcrypt = require("bcryptjs");
const { render } = require("../app.js");

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

//ONGS
router.get("/ngos", (req, res, next) => {
  res.render("ngos.hbs");
});

//LOG IN

router.get("/login", (req, res, next) => {
  res.render("auth/login.hbs");
});

router.post("/login", (req, res, next) => {
  const { email, password } = req.body;
  UserModel.findOne({email})
    .then((response) => {
      if (response) {
        bcrypt
          .compare(password, response.password)

          .then((matches) => {
            if (matches) {
              // req.session.logedUser= response;
              res.redirect("/profile");
            } else {
              res.render("auth/login.hbs", {
                msg: "Password dont match, try again",
              });
            }
          })
          .catch((error) => {
            next(error);
          });
      } else {
        res.render("login.hbs", { msg: "Name does not exist" });
      }
    })
    .catch((error) => {
      next(error);
    });
});

//SIGNUP

router.get("/signup", (req, res, next) => {
  res.render("auth/signup.hbs");
});

router.post('/signup',(req,res,next)=>{
   const { name,email, password } = req.body;

   if(!name||!email||!password){
     res.render('auth/signup',{msg:'Please enter all the fields'})
     return
   }
     let salt = bcrypt.genSaltSync(10);
     let hash = bcrypt.hashSync(password, salt);
     UserModel.create({ name, email, password: hash })
       .then(() => {
         res.redirect("/");
       })
       .catch((error) => {
         next(error);
       });

})
router.get("/profile", (req, res, next) => {
  res.render("profile.hbs");
});

module.exports = router;
