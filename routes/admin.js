/*
 * Dependancies
 */

var fs = require('fs')
  , core = require('../lib/core/core')

/*
 * Variables
 */

var filename, reqObj, pathname

/*
 * Loads either the admin page, or returns the metric.log
 * if it exists and is requested.
 */

exports = module.exports = admin;

function admin(app) {
  return function admin(req, res) {
    reqObj = core.getUrlObj(req), pathname = reqObj.pathname.replace('/8dm1n/','')
    if (pathname === 'metric.log') {
      filename = app.ROOT + '/data/log/metric.log'
      fs.exists(filename, function(exists) {
        if (exists) {
          fs.readFile(filename, 'utf-8', function(err, data) {
            if (err) console.log(err)
            else {
              res.writeHead(200, {
                'Content-Type' : 'application/octet-stream',
                'Content-Length': data.length,
                'Content-disposition': 'filename=' + 'metric.log'
              })
              res.end(data)
            }
          });          
        }
      })
    } else {
      res.render('admin', { menu: app.library.menu });
    }

  }
}