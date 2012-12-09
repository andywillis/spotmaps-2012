var fs = require('fs')
//var data = fs.readFileSync('./lib/hex.txt', 'utf-8');
//var data = JSON.stringify(require('../data/temp'))

exports = module.exports = bin;

function bin(app) {
  return function bin(req, res) {

    var library = app.library
      , core = require('../lib/core/core')
      , url = core.getUrlObj(req), obj = {}
      , data = core.jsonPath(library, '$..films[?(@.id===' + url.query.id + ')]')[0]

    fs.readFile('./public/maps/' + data.title + '.hex', 'utf-8', function(err, data) {
      if (err) console.log(err)
      else {
        res.send(data)      
      }
    });

  }  
}
