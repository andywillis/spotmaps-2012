var core = require('../tools/core/core')
  , fs = require('fs')

exports = module.exports = serveData;

function serveData(app) {

  return function serveData(req, res) {
    var reqObj = core.getUrlObj(req)
      , pathname = reqObj.pathname.replace('/static/','')
      , contentType = reqObj.contentType
      , foundStaticFile = app.static.spotmaps[pathname]
      , bundle = function(entry) {
          var metadata = entry.metadata
            , modified = metadata.modified
            , bytes = metadata.bytes
            , etag = bytes + '-' + Date.parse(modified)
            , data = entry.data

          res.setHeader('Last-Modified', modified);

          if (req.headers['if-none-match'] === etag) {
            console.log(pathname, 304);
            res.statusCode = 304
            res.end()
          } else {
            console.log(pathname, 200);
            res.setHeader('Content-length', bytes)
            res.setHeader('Content-Type', contentType)
            res.setHeader('ETag', etag);
            res.statusCode = 200
            res.end(data)
          }
        }

    if (foundStaticFile) {
      bundle(foundStaticFile)
    } else {
      app.dbox.get(pathname, function(status, data, metadata) {
        var entry = app.static.spotmaps[pathname] = {}
        entry.data = data
        entry.metadata = metadata
        bundle(entry)
      })
    }
    
  }

}