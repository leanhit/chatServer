var express = require('express');
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('hooker', { title: 'chatzalo.vn' });
});

module.exports = router;
