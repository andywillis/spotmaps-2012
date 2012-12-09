var fs = require('fs')
  , nbLoop3 = require('nbLoop3')
  ;

exports = module.exports = JSONFilesToArray;

function JSONFilesToArray(folder, callback) {
  fs.readdir(folder, function(err, files) {
    if (err) console.log(err);
    else {
      if (files.length === 0) callback(null)
      nbLoop3({
        arr: files,
        fn: function() {
          var $ = arguments[0]
          var data = JSON.parse(fs.readFileSync(folder + $.el, 'utf-8'))
          $.out.push(data)
          $.cb($.out, $.i, $.params)
        },
        cb: function (count, results) {
          console.log('JSON built.');
          callback(results)
        }
      })
    }
  })
}