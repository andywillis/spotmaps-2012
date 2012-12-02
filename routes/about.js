// Render the Jade 'About' template

var filmCount = require('../tools/count')()

module.exports = function(req, res){
  res.render('about', {filmCount: filmCount});
};