var fs = require('fs')

exports = module.exports = bin;

function bin(app) {

  /*
   * Checks the library for the film with the right id,
   * pulls the hex from the cache if it's available,
   * or loads it from disk if it isn't.
   */

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
        if (err) {
          console.log(err)
          res.send(404)
        } else {
          app.static.hex[data.title] = data
          res.send(data)
        }
      });
    }

  }  

}