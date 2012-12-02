/**
 * This module listens to incoming spotmap requests
 * and sends the appropriate spotmaps as JSON data
 * down the wire. At the moment the JSON is stored in memory
 * but it will be migrated to a database soon
 */

var core = require('../tools/core/core')
  , genres = require('../data/genres')
  , films = require('../data/films')
  , limit = 5

/**
 * Pull all films from the film list that match the genre using jsonPath
 * and splice the range out.
 * Paging is not implementated (021212)
 */

function extractData(obj, callback) {
  if (obj.genre === 'All') {
    callback(films.slice(0, limit))
  } else {
    var data = core.jsonPath(films, '$..[?(@.genre==="' + obj.genre + '")]')
    if (data) {
      if (data.length > limit) {
        callback(data.slice(0, limit))
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
  var url = core.getUrlObj(req)
  genre = url.query.genre
  extractData({
    genre: genre
  }, function(data) {
    if (data) {
      res.send(JSON.stringify(data))
    } else {
      res.send(data)
    }
  })
};