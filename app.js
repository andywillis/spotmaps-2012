/**
 * Module dependencies.
 */

var express = require('express')
  , core = require('./tools/core/core')
  , http = require('http')
  , path = require('path')
  , staticAsset = require('static-asset')

/**
 * Initialise express
 */

core.clear()
var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view options', { layout: false });
  app.set('view engine', 'jade');
  app.use(express.favicon('public/favicon.ico'));
//  app.use(express.logger('dev'));
//  app.use(express.bodyParser());
//  app.use(express.methodOverride());
//  app.use(express.cookieParser('your secret here'));
//  app.use(express.session());
  app.use(app.router);
//  app.use(require('less-middleware')({ src: __dirname + '/public/stylesheets/less', once: true, compress: true }));
  app.use(staticAsset(__dirname + 'public') );
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

/**
  * Add dropbox access
  */

var config = require('./config')
var dbox  = require("dbox")
var dbApp   = dbox.app({ "app_key": config.key, "app_secret": config.secret })
app.dbox = dbApp.client(config.access_token)
app.dbox.account(function(status, reply){
  if (reply.uid === 80737100) console.log('Dropbox account found');
  else console.log('Error locating Dropbox account.');
})

var staticObj = {
  spotmaps: {},
  maps: {},
  rgb: {}
}

app.static = staticObj;

/**
 * Descrive the site routes
 */

app.get(/^(\/|\/home)$/, require('./routes/index'));
//app.get('/latest', routes.spotmaps.latest);
app.get('/genre/*', require('./routes/genre'));
app.get('/about', require('./routes/about'));
app.get('/get/*', require('./routes/get'));
app.get('/static/*', require('./routes/static')(app))

/**
 * Run the server
 */

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});