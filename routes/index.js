const router = require('express').Router();

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

let nora = 'adiossss';

module.exports = router;
