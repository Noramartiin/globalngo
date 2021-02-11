const router = require('express').Router();

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

let nora = 'adios';

module.exports = router;
