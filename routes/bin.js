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
      , filename = data.title
      , foundHexFile = app.static.hex[data.title]
      , fileLocation = 'maps/' + filename + '.hex'

    if (foundHexFile) {
      console.log('From cache.');
      res.send(foundHexFile)
    } else {
      app.dbox.get(fileLocation, function(status, data, metadata) {
        if (status && status === 200) {
          app.static.hex[filename] = data
          res.send(data)
        } else {
          console.log(status,'Error loading hex file:', fileLocation);
        }
      })
/*      fs.readFile('./public/maps/' + data.title + '.hex', 'utf-8', function(err, data) {
        if (err) {
          console.log(err)
          res.send(404)
        } else {
          app.static.hex[data.title] = data
          res.send(data)
        }
      });
*/      
    }

  }  

}