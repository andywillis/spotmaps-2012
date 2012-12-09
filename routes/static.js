var core = require('../lib/core/core')
  , fs = require('fs')

exports = module.exports = serveData;

/*
 * The main function returns the function that's added to the
 * express stack. This function looks for the pathname in the static
 * spotmaps object. If it's found it is served, if not, the file is retrieved
 * from dropbox.
 *
 * The serve function uses if-none-match to see if the file needs to be served from the
 * server. If found a 304 code is returned and the image loaded from browser cache,
 * otherwise it's served down the wire.
 */

function serveData(app) {

  return function serveData(req, res) {

    var reqObj = core.getUrlObj(req)
      , pathname = reqObj.pathname.replace('/static/','')
      , contentType = reqObj.contentType
      , foundStaticFile = app.static.spotmaps[pathname]
    
    function serve(entry) {
      var metadata = entry.metadata
        , modified = metadata.modified
        , bytes = metadata.bytes
        , etag = bytes + '-' + Date.parse(modified)
        , data = entry.data

      res.setHeader('Last-Modified', modified);

      if (req.headers['if-none-match'] == etag) {
        res.statusCode = 304
        res.end()
      } else {
        res.setHeader('Content-length', bytes)
        res.setHeader('Content-Type', contentType)
        res.setHeader('ETag', etag);
        res.statusCode = 200
        res.end(data)
      }
    }

    if (foundStaticFile) {
      serve(foundStaticFile)
    } else {
      app.dbox.get(core.decode(pathname), function(status, data, metadata) {
        if (status && status === 200) {
          var entry = app.static.spotmaps[pathname] = {}
          entry.data = data
          entry.metadata = metadata
          serve(entry)
        } else {
          console.log('File not found');
          res.send(404)
        }
      })
    }
    
  }

}