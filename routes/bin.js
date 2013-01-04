/*
 * Dependancies
 */

var fs = require('fs');

exports = module.exports = bin;

/*
 * Returns the bin function
 */

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
      , fileLocation = 'hex/' + filename + '.hex'
      ;

    if (foundHexFile) {
      res.send(foundHexFile);
    } else {
      app.dbox.get(fileLocation, function(status, data, metadata) {
        if (status && status === 200) {
          app.static.hex[filename] = data;
          res.send(data);
        } else {
          console.log(status,'Error loading hex file:', fileLocation);
        }
      });
    }

  };

}