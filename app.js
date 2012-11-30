/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , path = require('path')
  , staticAsset = require('static-asset')

/**
 * Initialise express
 */

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view options', { layout: false });
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
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
 * Descrive the site routes
 */

app.get(/^(\/|\/home)$/, require('./routes/index'));
//app.get('/latest', routes.spotmaps.latest);
app.get('/genre/*', require('./routes/genre'));
app.get('/about', require('./routes/about'));
app.get('/get/*', require('./routes/get'));

/**
 * Run the server
 */

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});