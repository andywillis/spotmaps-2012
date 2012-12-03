var ROOT = __dirname
  , fs = require('fs')
  , folder = ROOT + '/../public/maps/'
  , nbLoop3 = require('nbLoop3')
  , json2arr = require('./JSONFilesToArray')
  , rgb2hex = require('rgb2hex')
  , outputFolder = ROOT + './'

// For each file in the maps folder
json2arr(folder, function(results) {
  nbLoop3({
    arr: results,
    out: [],
    fn: function() {
      var $ = arguments[0]
      // Add a filename
      $.el.filename = $.el.title + '.png'
//      $.el.filename = $.el.title.replace(/ /g, '_') + '.png'
      // Delete the RGB property
      delete $.el.rgba
      delete $.el.author
      // Add additional properties
      $.el.director = ''
      $.el.genre = ''
      $.el.writer = ''
      $.el.year = 1974
      $.out.push($.el)
      $.cb($.out, $.i, $.params)
    },
    cb: function(count, results) {
      console.log('Data processed.');
      console.log(results);
      fs.writeFile('filmList.js', JSON.stringify(results, null, '\t'));
    }
  })
})