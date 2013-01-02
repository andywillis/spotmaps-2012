/*
 * Dependancies
 */

var fs = require('fs')
  , core = require('../lib/core/core')
  ;

/*
 * Variables
 */

var filename, reqObj, pathname
  , number, content, len
  ;

/*
 * Loads either the admin page, or returns the metric.log
 * if it exists and is requested.
 */

exports = module.exports = admin;

function admin(app) {
  return function admin(req, res) {
    reqObj = core.getUrlObj(req), pathname = reqObj.pathname.replace('/8dm1n/','');
    switch(pathname) {

      case 'metric.log':
        filename = app.ROOT + '/data/log/metric.log';
        fs.exists(filename, function(exists) {
          if (exists) {
            fs.readFile(filename, 'utf-8', function(err, data) {
              if (err) console.log(err);
              else {
                res.writeHead(200, {
                  'Content-Type' : 'application/octet-stream',
                  'Content-Length': data.length,
                  'Content-disposition': 'filename=' + 'metric.log'
                });
                res.end(data);
              }
            });
          }
        });
      break;

      case 'updateRSS':
        updateList = core.jsonPath(app.library, '$..films[?(@.updated===true)]');
        len = updateList.length;
        number = (len === 1) ? updateList[len - 1].id : updateList[len - 1].id - updateList[len - 2].id;
        rssTemplate = fs.readFile('./views/includes/rssTemplate.html', 'utf-8', function(err, template) {
          if (err) {
            console.log(err);
          } else {
            content = template.replace('#{number}', number);
            fs.writeFile('./public/rss/spotmaps.rss', content, 'utf-8', function() {
              console.log('RSS feed updated.');
              res.send('hallo');
            });
          }
        });
      break;

      default:
        res.render('admin', { menu: app.library.menu });
      break;

    }

  };
}