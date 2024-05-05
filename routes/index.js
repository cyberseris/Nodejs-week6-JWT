var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
  // #swagger.ignore = true
  res.render('index', { title: 'Express' });
});

module.exports = router;
