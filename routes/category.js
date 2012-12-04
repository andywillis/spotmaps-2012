// Render the Jade 'Genre' template

var filmCount = require('../tools/count')()

module.exports = function(req, res){
  res.render('category', {filmCount: filmCount});
};