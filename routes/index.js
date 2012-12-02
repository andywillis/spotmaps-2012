// Home page

var filmCount = require('../tools/count')()

module.exports = function(req, res){
  res.render('index', {filmCount: filmCount});
};