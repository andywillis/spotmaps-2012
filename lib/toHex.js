var fs = require('fs')
  , arr = require('./arr')
  , len = arr.length
  , folder = '../public/maps/'

fs.readdir(folder, function(err, list){
    for (var f in list) {
      fs.readFile(folder + list[f], 'utf-8', function(err, file) {
        
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
        fs.writeFile(folder + file.title + '.hex', out.join(''), 'utf-8')

      })
    }

})

/*


var buf = new Buffer(out.length/2), offset = 0
for (var i = 0, len = out.length; i < len; i++) {
  col = out[i]
  buf.write(col, offset, 'hex');
  offset++
}

fs.writeFile('./buf.sma', buf);


var col, oldcol = null, count = 0, p = [], newpatt
for (var i = 0, len = out.length; i < len; i+=2) {
  col = out.slice(i, i+2), newpatt = '#{col}:#{count},'
  if (oldcol !== null && col !== oldcol) {
    var newpatt = newpatt
      .replace('#{col}', oldcol)
      .replace('#{count}', count)
    p.push(newpatt)
    count = 1
  }
  if (oldcol === null || col === oldcol) {
    count++
  }
  oldcol = col
}

var p = p.join('')
fs.writeFile('./compress.txt', p, 'utf-8')
var b = new Buffer(p).toString('base64')
console.log(b);

/*
var out = out
  , obj = {}
  , zero = 0

for (var i = 0, len = out.length; i < len; i++) {
  var col = out[i]
  if (col === '00') zero++
  if (obj[col] && col !== '00') { obj[col].push(i) } else { obj[col] = [] }
}
console.log(zero, Object.keys(obj).length);
*/
//fs.writeFile('./obj.txt', JSON.stringify(obj), 'utf-8')