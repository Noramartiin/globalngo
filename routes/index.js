const router = require('express').Router();

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

let nora = 'hola';
console.log(nora);

module.exports = router;
