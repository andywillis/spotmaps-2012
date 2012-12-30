/*
 * Dependancies
 */

var fs = require('fs')
  , express = require('express')
  , config = require('./config')
  , colors = require('colors').setTheme(config.colorTheme)
  , core = require('./lib/core/core')
  , http = require('http')
  , path = require('path')

/*
 * Variables
 */

var app, dbox, dbApp, libraryLocation

/*
 * Blank the console and configure express
 */

core.clear()
console.log((config.name + ' v' + config.version).appName);
app = express();
app.configure(function () {
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view options', { layout: false });
  app.set('view engine', 'jade');
  app.use(express.favicon('public/favicon.ico'));
  app.use(require('less-middleware')({ 
    compress:true, 
    debug: false, 
    force: true,
    once: true,
    prefix: '/stylesheets',
    src: __dirname + '/less', 
    dest: __dirname + '/public/stylesheets/'
  }));
//  app.use(require('./lib/metric.js')());
  app.use(app.router);
  app.use(express.compress());
  app.use(express.static(path.join(__dirname, "public"), { maxAge: 360000 }));
});

app.configure('development', function () {
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
  hex: {},
  maps: {},
  rgb: {}
}

/*
 * Load the film library
 */

libraryLocation = './data/library.json'
app.library = JSON.parse(fs.readFileSync(libraryLocation, 'utf-8'))
app.library.menu = require('./lib/count')(app.library.films, 'genre', 'value', 12)
app.library.genres = require('./lib/count')(app.library.films, 'genre', 'key', null)
app.library.directors = require('./lib/count')(app.library.films, 'director', 'key', null)
app.library.writers = require('./lib/count')(app.library.films, 'writer', 'key', null)
app.library.years = require('./lib/count')(app.library.films, 'year', 'key', null)

/*
 * Describe the site routes, passing app as a parameter.
 * The last 'route' is middleware to catch 404s.
 */

app.get(/^(\/|\/home)$/, require('./routes/index')(app));
app.get(/^\/(genre|year|director|writer)\/*/, require('./routes/category')(app));
app.get('/list', require('./routes/list')(app))
app.get('/search', require('./routes/search')(app))
app.get(/^\/admin\/*/, require('./routes/admin')(app));
app.get('/about', require('./routes/about')(app));
app.get('/show/*', require('./routes/show')(app));
app.get('/json/*', require('./routes/json')(app));
app.get('/bin/*', require('./routes/bin')(app));
app.get('/static/*', require('./routes/static')(app))
app.use(require('./routes/fourohfour')(app));

/*
 * Run the server
 */

http.createServer(app).listen(app.get('port'), function(){
  console.log(('Express server listening on port ' + app.get('port')).server);
});