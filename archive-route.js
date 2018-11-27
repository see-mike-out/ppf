var express = require('express')
var router = express.Router()

router.get('/ls_to_ss', function(req, res) {
  res.render('archive/lstoss_page');
});
router.get('/utopia', function(req, res) {
  res.render('archive/utopia');
});
router.get('/factcheck', function(req, res) {
  res.render('archive/factcheck');
});
router.get('/snucardnewsbot', function(req, res) {
  res.render('archive/snucardnewsbot');
});
router.get('/short-visuals', function(req, res) {
  res.render('archive/short_visuals');
});
router.get('/infographics', function(req, res) {
  res.render('archive/infographics', {is_infographics: true});
});

module.exports = router;