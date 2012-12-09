// Module dependencies.

var fs = require('fs')
  , express = require('express')
  , config = require('./config')
  , colors = require('colors').setTheme(config.colorTheme)
  , core = require('./lib/core/core')
  , http = require('http')
  , path = require('path')
  , staticAsset = require('static-asset')

// Vars

var app, dbox, dbApp, libraryLocation

// Blank the console and configure express

core.clear()
console.log((config.name + ' v' + config.version).appName);
app = express();

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

dbox  = require("dbox")
dbApp   = dbox.app({ "app_key": config.dropbox.key, "app_secret": config.dropbox.secret })
app.dbox = dbApp.client(config.dropbox.access_token)
app.dbox.account(function(status, reply) {
  if (reply && reply.uid === 80737100) console.log('Dropbox account found'.ok);
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
 * Load the film library
 */

libraryLocation = './data/library.json'
app.library = JSON.parse(fs.readFileSync(libraryLocation, 'utf-8'))
app.library.count = require('./lib/count')()

/*
 * Describe the site routes, passing app as a parameter.
 * The last 'route' is middleware to catch 404s.
 */

app.get(/^(\/|\/home)$/, require('./routes/index')(app));
app.get(/^\/(genre|year|director|writer)\/*/, require('./routes/category')(app));
app.get('/search', require('./routes/search')(app))
app.get('/about', require('./routes/about')(app));
app.get('/show/*', require('./routes/show')(app));
app.get('/json/*', require('./routes/json')(app));
app.get('/bin/*', require('./routes/bin')(app));
app.get('/static/*', require('./routes/static')(app))
app.use(require('./routes/fourohfour')(app));

// Run the server

http.createServer(app).listen(app.get('port'), function(){
  console.log(('Express server listening on port ' + app.get('port')).server);
});