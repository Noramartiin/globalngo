const router = require("express").Router();
const bcrypt = require("bcryptjs");

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});



//ONGS
router.get('/ngos', (req, res, next)=>{
  res.render('ngos.hbs')
})

//LOG IN

router.get('/login', (req, res, next)=>{
  res.render('auth/login.hbs')
})

router.post('/login', (req, res,next)=>{
    const{yourName, yourPassword}= req.body
    .then((response)=>{
      if(response){
          bcrypt.compare(yourPassword, response.password)
      
        .then((matches)=>{
          if(matches){
            req.session.logedUser= response;
            // res.redirect('/')
          }
          else{
            res.render('login.hbs', {msg:'Password dont match, try again'})
          }
      })
      }
      else{
        res.render("login.hbs", { msg: "Username does not exist" });
      }
    })
    .catch((error)=>{
      next(error)
    })  

})

//SIGNUP

router.get('/signin',(req, res, next)=>{
  res.render('auth/signin.hbs')
})


module.exports = router;
