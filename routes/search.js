// Render the Jade 'Search' template

var filmCount = require('../tools/count')()

module.exports = function(req, res){
  res.render('search', {filmCount: filmCount});
};