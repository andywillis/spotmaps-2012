/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , spotmaps = require('./routes/spotmaps')
  , about = require('./routes/about')
  , http = require('http')
  , path = require('path');

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
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  app.use(app.router);
  app.use(require('less-middleware')({ src: __dirname + '/public' }));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

/**
 * Descrive the site routes
 */

app.get(/^(\/|\/home)$/, routes.index);
app.get('/latest', spotmaps.latest);
app.get('/about', about.view);

/**
 * Run the server
 */

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});