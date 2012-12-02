var core = require('../tools/core/core')
  , genres = require('../data/genres')
  , films = require('../data/films')
  , filmCount = {}

module.exports = function () {
  for (var p in genres) {
    var genre = genres[p]
    filmCount[genre] = core.jsonPath(films, '$..[?(@.genre==="' + genre + '")]').length || 0
  }
  return filmCount
}