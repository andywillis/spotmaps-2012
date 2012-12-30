var fs = require('fs')
  , arr = require('./arr')
  , len = arr.length
  , inputFolder = '../data/maps/'
  , outputFolder = '../public/maps/'

exports = module.exports = toHex() {
  fs.readdir(inputFolder, function(err, list){
      for (var f in list) {
        fs.readFile(inputFolder + list[f], 'utf-8', function(err, file) {
          
          var file = JSON.parse(file)
          var rgb = JSON.parse(file.rgba)
            , len = rgb.length
            , out = [], col

          for (var i = 0; i < len; i++) {
            var el = rgb[i]
            for (var ii = 0; ii < 3; ii++) {
              var col = el[ii].toString(16)
              col = col.length === 1 ? '0' + col : col
              out.push(col)
            }
          }
          fs.writeFile(outputFolder + file.title + '.hex', out.join(''), 'utf-8')
        })
      }

  })
}