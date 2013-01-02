var fs = require('fs')
  , ROOT = __dirname
  , dataFolder = ROOT + '/../data/'
  , mapFolder = ROOT + '/../data/maps/'
  , hexFolder = '../data/hex/'
  , aseFolder = '../data/ase/'
  , nbLoop3 = require('nbLoop3')
  , filenameTemplate = 'library-stub-#{dateStamp}.json'
  , out = {}, ase = {}, size = 32
  , core = require('./core')
  , swatch = require('swatch')
  ;

function getNextId(callback) {
  var nextId, i, len;
  fs.readFile(dataFolder + 'library.json', function(err, data) {
    if (err) {
      console.log(err);
    } else {
      var films = JSON.parse(data).films, arr = [];
      for(i = 0, len = films.length; i < len; i++) {
        arr.push(films[i].id);
      }
      nextId = Math.max.apply(null, arr) + 1;
      callback(nextId);
    }
  });
}

function toHex(rgb, filename) {
  var len = rgb.length, out = [], col;
  for (var i = 0; i < len; i++) {
    var el = rgb[i];
    for (var ii = 0; ii < 3; ii++) {
      col = el[ii].toString(16);
      col = col.length === 1 ? '0' + col : col;
      out.push(col);
    }
  }
  fs.writeFile(hexFolder + filename + '.hex', out.join(''), 'utf-8');
}

(function createLibrary() {
  getNextId(function(id) {
    fs.readdir(mapFolder, function(err, files) {
      if (err) console.log(err);
      else {
        if (files.length === 0) callback(null);
        nbLoop3({
          arr: files,
          fn: function() {
            var $ = arguments[0];
            var data = JSON.parse(fs.readFileSync(mapFolder + $.el, 'utf-8'));
            data.filename = data.title + '.jpg';
            data.id = id++;
            data.display = true;
            data.director = [];
            data.genre = [];
            data.writer = [];
            data.year = 1974;
            rgb = JSON.parse(data.rgba);
            toHex(rgb, data.title);
            ase.title = data.title;
            ase.data = rgb;
            swatch(ase, size, function(buffer) {
              fs.writeFile(aseFolder + data.title + '.ase', buffer);
            });
            delete data.author;
            delete data.rgba;
            $.out.push(data);
            $.cb($.out, $.i, $.params);
          },
          cb: function (count, results) {
            out.films = results;
            filename = filenameTemplate.replace('#{dateStamp}', core.dateStamp());
            console.log(filename);
            fs.writeFile(dataFolder + filename, JSON.stringify(out, null, '\t'));
            console.log('Film library created.');
          }
        });
      }
    });
  });
}());