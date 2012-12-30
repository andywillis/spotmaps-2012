/*
 * Dependancies
 */

var fs = require('fs')
  , core = require('./core')
  , metric = {}, metricRoute
  , metricRouteRegex = /(show|genre|director|writer|year)/
  , metricFileLocation = './data/log/metric.log'

exports = module.exports = metricLog;

/*
 * Return function that logs user request information.
 * Reuses metric object for efficiency.
 */

function metricLog() {
  fs.exists(metricFileLocation, function(exists) {
    if (exists) fs.unlinkSync(metricFileLocation);
  })
  return function(req, res, next) {
    metricRoute = core.getUrlObj(req).pathname.split('/')[1]
    if (metricRouteRegex.test(metricRoute)) {
      core.wipe(metric);
      metric['url'] = req['url'];
      metric['datestamp'] = new Date();
      metric['remoteAddress'] = req.connection['remoteAddress']
      metric['user-agent'] = req.headers['user-agent']
      metric['referer'] = req.headers['referer']
      fs.appendFile(metricFileLocation, '\n' + JSON.stringify(metric), 'utf-8');
    }
    next()
  }

}