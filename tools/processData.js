var ROOT = __dirname
  , fs = require('fs')
  , folder = ROOT + '/../public/maps/'
  , nbLoop3 = require('nbLoop3')
  , json2arr = require('./JSONFilesToArray')
  , rgb2hex = require('rgb2hex')
  , binFolder = ROOT + '/../public/rgb/'

json2arr(folder, function(results) {
  nbLoop3({
    arr: results,
    out: [],
    fn: function() {
      var $ = arguments[0]
      $.el.filename = $.el.title.replace(/ /g, '_') + '.sma'
      $.el.rgb = eval($.el.rgba)
      delete $.el.rgba
      $.out.push($.el)
      $.cb($.out, $.i, $.params)
    },
    cb: function(count, results) {
      console.log('Data processed.');
      nbLoop3({
        arr: results,
        out: 0,
        fn: function () {
          var $ = arguments[0]
          rgb2hex($.el.rgb, function (buffer) {
            fs.writeFile(binFolder + $.el.filename, buffer);
            $.out++
            $.cb($.out, $.i, $.params)
          })
        },
        cb: function (count, results) {
          console.log(count + ' files saved.');
        }
      })
    }
  })
})  

var t = new Array(10000)
//console.log(t.length);

nbLoop3({
  arr: t,
  fn: function () {
    var $ = arguments[0]
    $.out.push(0)
    $.cb($.out, $.i, $.params)
  },
  cb: function(count, results) {
    console.log(results.length);
  }
})