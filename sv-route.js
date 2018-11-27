var express = require('express')
var router = express.Router()

router.get('/four-seasons', function(req, res) {
  res.render('sv/four_seasons', {layout: 'sv.handlebars', title: '서울의 사계절', url: req.originalUrl, code: 'four_seasons'});
});
router.get('/womens-unpaid-work', function(req, res) {
  res.render('sv/wuw', {layout: 'sv.handlebars', title: "Women's Unpaid Work", url: req.originalUrl, code: 'wuw'});
});

module.exports = router;