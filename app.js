// Module dependencies.

var express = require('express')
  , config = require('./config')
  , colors = require('colors').setTheme(config.colorTheme)
  , core = require('./tools/core/core')
  , http = require('http')
  , path = require('path')
  , staticAsset = require('static-asset')

// Blank the console and configure express

core.clear()
console.log((config.name + ' v' + config.version).appName);
var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view options', { layout: false });
  app.set('view engine', 'jade');
  app.use(express.favicon('public/favicon.ico'));
  app.use(require('less-middleware')({ src: __dirname + '/public/stylesheets/less' }));
  app.use(app.router);
  app.use(staticAsset(__dirname + 'public') );
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

/*
 * Secure dropbox access using the acquired information
 * in the config file.
 */

var dbox  = require("dbox")
var dbApp   = dbox.app({ "app_key": config.dropbox.key, "app_secret": config.dropbox.secret })
app.dbox = dbApp.client(config.dropbox.access_token)
app.dbox.account(function(status, reply){
  if (reply.uid === 80737100) console.log('Dropbox account found'.ok);
  else console.log('Error locating Dropbox account.'.ok);
})

/*
 * Set up the static store for the images,
 * map data, and rgb files. The app is passed to the
 * static route when that route is called.
 */

app.static = staticObj = {
  spotmaps: {},
  maps: {},
  rgb: {}
}

/*
 * Describe the site routes.
 * The last 'route' is middleware to catch 404s.
 */

app.get(/^(\/|\/home)$/, require('./routes/index'));
app.get('/genre/*', require('./routes/genre'));
app.get('/search', require('./routes/search'))
app.get('/about', require('./routes/about'));
app.get('/get/*', require('./routes/get'));
app.get('/static/*', require('./routes/static')(app))
app.use(function(req, res) { res.render('404') });

// Run the server

http.createServer(app).listen(app.get('port'), function(){
  console.log(('Express server listening on port ' + app.get('port')).server);
});