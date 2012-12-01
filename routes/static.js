var core = require('core')

exports = module.exports = serveData;

function serveData(dbox) {

  return function serveData(req, res) {
    var reqObj = core.getUrlObj(req)
      , pathname = reqObj.pathname.replace('/static/','')
      , contentType = reqObj.contentType

    dbox.get(pathname, function(status, data, metadata) {
      res.writeHead(200, {'Content-Type': contentType})
      res.end(data)
    })
    
  }

}
