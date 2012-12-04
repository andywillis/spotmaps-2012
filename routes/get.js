/**
 * This module listens to incoming spotmap requests
 * and sends the appropriate spotmaps as JSON data
 * down the wire. At the moment the JSON is stored in memory
 * but it will be migrated to a database soon
 */

var core = require('../tools/core/core')
  , genres = require('../data/genres')
  , library = require('../data/films')
  , films = library.films
  , limit = 5

/**
 * Pull all films from the film list that match the genre using jsonPath
 * and splice the range out.
 * Paging is not implementated (021212)
 */

function extractData(obj, callback) {
  var key = Object.keys(obj)[0]
    , val = obj[key]
    , data
    ;

  if (val === 'All') {
    callback(films.slice(0, limit))
  } else {
    // Check for numeric or string
    if (key === 'year') {
      data = core.jsonPath(library, '$..films[?(@.' + key + '===' + val + ')]')
    } else {
      if (key === 'director' || key === 'writer') {
        data = core.jsonPath(library, '$..films[?(@.' + key + '.indexOf("'+ val +'") > -1)]')
      } else {
        data = core.jsonPath(library, '$..films[?(@.' + key + '==="' + val + '")]')
      }
    }
    if (data) {
      if (data.length > limit) {
        callback(data)
        //callback(data.slice(0, limit))
      } else {
        callback(data)
      }
    } else {
      callback(false)
    }
  }
}

/*
 * Retrieve the URL object (contains path and query information),
 * extract the relevant data from the list of films
 * and send that data as JSON down the wire.
 */

module.exports = function(req, res) {
  var url = core.getUrlObj(req), obj = {}
  if (url.query.genre !== undefined) obj.genre = url.query.genre
  if (url.query.year !== undefined) obj.year = url.query.year
  if (url.query.writer !== undefined) obj.writer = url.query.writer
  if (url.query.director !== undefined) obj.director = url.query.director
  extractData(obj, function(data) {
    if (data) {
      res.send(JSON.stringify(data))
    } else {
      res.send(data)
    }
  })
};