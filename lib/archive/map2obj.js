var ROOT = __dirname
  , fs = require('fs')
  , folder = ROOT + '/../data/maps/'
  , nbLoop3 = require('nbLoop3')
  , json2arr = require('./JSONFilesToArray')
  , rgb2hex = require('rgb2hex')
  , outputFolder = ROOT + './'
  , toHex = require('./toHex')

// For each file in the maps folder
json2arr(folder, function(results) {
  nbLoop3({
    arr: results,
    out: [],
    fn: function() {
      var $ = arguments[0]
      // Delete old properties
      toHex($.el.rgba);
      delete $.el.rgba
      delete $.el.author
      // Add additional properties
      $.el.filename = $.el.title + '.jpg'
      $.el.id = $.i
      $.el.director = []
      $.el.genre = ''
      $.el.writer = []
      $.el.year = 1974
      // Push the object to the outgoing array
      $.out.push($.el)
      // Callback
      $.cb($.out, $.i, $.params)
    },
    cb: function(count, results) {
      fs.writeFile('library.json', JSON.stringify(results, null, '\t'));
      console.log('Film library created.');
    }
  })
})