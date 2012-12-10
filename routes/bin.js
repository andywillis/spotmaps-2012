var fs = require('fs')

exports = module.exports = bin;

function bin(app) {

  return function bin(req, res) {
    var library = app.library
      , core = require('../lib/core/core')
      , url = core.getUrlObj(req), obj = {}
      , data = core.jsonPath(library, '$..films[?(@.id===' + url.query.id + ')]')[0]
      , foundHexFile = app.static.hex[data.title]

    if (foundHexFile) {
      res.send(foundHexFile)
    } else {
      fs.readFile('./public/maps/' + data.title + '.hex', 'utf-8', function(err, data) {
        if (err) console.log(err)
        else {
          app.static.hex[data.title] = data
          res.send(data)
        }
      });
    }

  }  

}