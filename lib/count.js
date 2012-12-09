var fs = require('fs')
  , core = require('../lib/core/core')
  , genres = require('../data/genres')
  , films = JSON.parse(fs.readFileSync('./data/films.js', 'utf-8'))
  , filmCount = {}

module.exports = function () {
  for (var p in genres) {
    var genre = genres[p]
    filmCount[genre] = core.jsonPath(films, '$..[?(@.genre==="' + genre + '")]').length || 0
  }
  return filmCount
}