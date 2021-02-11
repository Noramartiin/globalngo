const router = require('express').Router();

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

let nora = 'oi, tudo bem?';

module.exports = router;
