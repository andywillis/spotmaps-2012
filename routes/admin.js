/*
 * Dependancies
 */

var core = require('../lib/core/core')
  , fs = require('fs')

/*
 * Return a function that either returns a log file or renders
 * the view.
 */

exports = module.exports = admin;

function admin(app) {
  return function admin(req, res) {
    var reqObj = core.getUrlObj(req)
      , pathname = reqObj.pathname.replace('/admin/', '')
      , contentType = reqObj.contentType

    if (pathname && pathname === 'metric.log') {
      fs.readFile('./data/log/metric.log', 'utf-8', function(err, data) {
        if (err) console.log(err);
        else {
          res.writeHead(200, {'Content-Type' : 'application/octet-stream', 'Content-Length': data.length, 'Content-disposition': 'filename=' + 'metric.log'})
          res.write(data)
          res.end()          
        }
      })
    } else {
      res.render('admin', {menu: app.library.menu});
    }
  }

}