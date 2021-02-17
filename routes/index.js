const router = require('express').Router();
const UserModel = require('../models/User.model.js');
const NGOModel = require('../models/Ngo.model');
const bcrypt = require('bcryptjs');
const { render } = require('../app.js');
const uploader = require('../middlewares/cloudinary.config.js');

/* GET home page */
router.get('/', (req, res, next) => {
  if (req.session.logedUser) {
    res.render('index', { logged: req.session.logedUser });
  } else {
    res.render('index');
  }
});

//SIGNUP PAGE
router.get('/signup', (req, res, next) => {
  res.render('auth/signup.hbs');
});
router.post('/signup', (req, res, next) => {
  //get data from the form
  const { name, email, password } = req.body;
  // checking if all the require inputs are completed
  if (!name || !email | !password) {
    res.render('auth/signup', { msg: 'Please enter all fields' });
    return;
  }
  // validation email sintax
  let re = /\S+@\S+\.\S+/;
  if (!re.test(email)) {
    res.render('auth/signup', { msg: 'Email not valid' });
  }
  // encrypting password
  let salt = bcrypt.genSaltSync(10);
  let hash = bcrypt.hashSync(password, salt);
  //check if email is already used
  UserModel.findOne({ email })
    .then(result => {
      if (result) {
        res.render('auth/signup', {
          msg: 'Email already in use, choose another one',
        });
      } else {
        //creating the user in the DB
        UserModel.create({ name, email, password: hash })
          .then(result => {
            req.session.logedUser = result;
            res.redirect('/profile/' + result._id);
          })
          .catch(err => {
            next(err);
          });
      }
    })
    .catch(err => {
      next(err);
    });
});

//LOG IN PAGE
router.get('/login', (req, res, next) => {
  res.render('auth/login.hbs');
});
router.post('/login', (req, res, next) => {
  //getting data from the form
  const { email, password } = req.body;
  // finding the user in the DB
  UserModel.findOne({ email })
    .then(result => {
      //checking if the email is in the DB
      if (result) {
        //comparing password with the encrypted password in DB
        bcrypt
          .compare(password, result.password)
          .then(matches => {
            if (matches) {
              req.session.logedUser = result;
              res.redirect('/profile/' + result._id);
            } else {
              res.render('auth/login.hbs', {
                msg: 'Password dont match, try again',
              });
            }
          })
          .catch(err => {
            next(err);
          });
      } else {
        res.render('login.hbs', { msg: 'Email does not exist' });
      }
    })
    .catch(err => {
      next(err);
    });
});

// ONGS PAGE
router.get('/ngos', (req, res, next) => {
  if (req.session.logedUser) {
    NGOModel.find()
      .then(data => {
        res.render('ngos.hbs', { data, logged: req.session.logedUser });
      })
      .catch(error => {
        next(error);
      });
  } else {
    NGOModel.find()
      .then(data => {
        res.render('ngos.hbs', { data });
      })
      .catch(error => {
        next(error);
      });
  }
});

// ONG INFO PAGE
router.get('/ngo-info/:id', (req, res, next) => {
  let id = req.params.id;
  if (req.session.logedUser) {
    NGOModel.findById({ _id: id })
      .then(result => {
        res.render('ngo-info.hbs', { result, logged: req.session.logedUser });
      })
      .catch(err => {
        next(err);
      });
  } else {
    NGOModel.findById({ _id: id })
      .then(result => {
        res.render('ngo-info.hbs', { result });
      })
      .catch(err => {
        next(err);
      });
  }
});

//SETTING COOKIES
const checkLogedInUser = (req, res, next) => {
  if (req.session.logedUser) {
    next();
  } else {
    res.redirect('/login');
  }
};

//DONATE
router.get('/donate', checkLogedInUser, (req, res, next) => {
  res.render('donate.hbs');
});

//PROFILE PAGE
router.get('/profile/:id', checkLogedInUser, (req, res, next) => {
  let id = req.params.id;
  UserModel.findById(id)
    .then(result => {
      NGOModel.find({ owner: id })
        .then(resultngos => {
          if (resultngos[0]) {
            res.render('profile.hbs', {
              logged: req.session.logedUser,
              result,
              resultngos,
            });
          } else {
            res.render('profile.hbs', {
              logged: req.session.logedUser,
              result,
              msgnongo: 'You do not have any NGO yet',
            });
          }
        })
        .catch(err => {
          next(err);
        });
    })
    .catch(err => {
      next(err);
    });
});
router.post('/profile/:id', (req, res, next) => {
  let id = req.params.id;
  const { name, email, oldPassword, newPassword } = req.body;
  UserModel.findOne({ _id: id }).then(result => {
    bcrypt
      .compare(oldPassword, result.password)
      .then(matches => {
        if (matches) {
          let salt = bcrypt.genSaltSync(10);
          let hash = bcrypt.hashSync(newPassword, salt);
          UserModel.findByIdAndUpdate(
            { _id: id },
            { name, email, password: hash }
          ).then(() => {
            NGOModel.find({ owner: id }).then(resultngos => {
              res.render('profile.hbs', {
                result,
                logged: req.session.logedUser,
                resultngos,
                msg: 'You profile has been modified',
              });
            });
          });
        } else {
          NGOModel.find({ owner: id }).then(resultngos => {
            res.render('profile.hbs', {
              result,
              logged: req.session.logedUser,
              resultngos,
              msg: 'You password does not match',
            });
          });
        }
      })
      .catch(err => {
        next(err);
      });
  });
});

//UPLOAD PROFILE IMAGE
router.post(
  '/uploadprofile',
  uploader.single('profileImg'),
  (req, res, next) => {
    UserModel.findByIdAndUpdate(req.session.logedUser._id, {
      profileImg: req.file.path,
    }).then(() => {
      res.redirect('/profile/' + req.session.logedUser._id);
    });
  }
);

//EDIT NGO
router.get('/new-ngo/:id/:idNgo/edit', checkLogedInUser, (req, res, next) => {
  let id = req.params.id;
  let idNgo = req.params.idNgo;
  UserModel.findById(id).then(uresult => {
    NGOModel.findById(idNgo)
      .then(nresult => {
        res.render('edit-ngo.hbs', {
          uresult,
          nresult,
          logged: req.session.logedUser,
        });
      })
      .catch(error => {
        next(error);
      });
  });
});
router.post(
  '/new-ngo/:id/:idNgo/edit',
  uploader.single('images'),
  (req, res, next) => {
    let id = req.params.id;
    let idNgo = req.params.idNgo;
    const { name, information, images, url, key } = req.body;
    NGOModel.findByIdAndUpdate(idNgo, {
      name,
      information,
      $push: { images: req.file.path },
      url,
      key,
      owner: id,
    })
      .then(() => {
        res.redirect('/profile/' + id);
      })
      .catch(error => {
        next(error);
      });
  }
);

//DELETE NGO
router.get('/new-ngo/:id/:idNgo/delete', (req, res, next) => {
  let id = req.params.id;
  let idNgo = req.params.idNgo;
  NGOModel.findByIdAndDelete(idNgo)
    .then(() => {
      res.redirect('/profile/' + id);
    })
    .catch(error => {
      next(error);
    });
});

//CREATE NEW NGO
router.get('/new-ngo/:id', checkLogedInUser, (req, res, next) => {
  let id = req.params.id;
  UserModel.findById(id)
    .then(result => {
      res.render('new-ngo.hbs', { result, logged: req.session.logedUser });
    })
    .catch(err => {
      next(err);
    });
});
router.post('/new-ngo/:id', uploader.single('images'), (req, res, next) => {
  let id = req.params.id;
  const { name, information, images, url, key } = req.body;
  console.log(req.body);
  NGOModel.findOne({ name })
    .then(ngo => {
      if (ngo) {
        res.render('new-ngo.hbs', {
          result: req.session.logedUser,
          logged: req.session.logedUser,
          msg: 'This NGO already exists',
        });
      } else {
        NGOModel.create({
          name,
          information,
          $push: { images: req.file.path },
          url,
          key,
          owner: id,
        })
          .then(() => {
            res.redirect('/profile/' + id);
          })
          .catch(err => {
            next(err);
          });
      }
    })
    .catch(err => {
      next(err);
    });
});

//DELETE PROFILE
router.get('/delete-profile/:id', checkLogedInUser, (req, res, next) => {
  let id = req.params.id;
  UserModel.findByIdAndDelete(id)
    .then(() => {
      req.session.destroy();
      res.redirect('/');
    })
    .catch(() => {});
});

// LOG OUT PAGE
router.get('/logout', checkLogedInUser, (req, res, next) => {
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;
