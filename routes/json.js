exports = module.exports = get;

/**
 * This module listens to incoming spotmap requests
 * and sends the appropriate spotmaps as JSON data
 * down the wire. At the moment the JSON is stored in memory
 * but it will be migrated to a database soon
 */

function get(app) {

  var fs = require('fs')
    , core = require('../lib/core/core')
    , library = app.library
    , films = library.films
    , limit = 5
    , byTitle = function(a, b) {
        var nameA = a.title.toLowerCase(), nameB = b.title.toLowerCase();
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        return 0;
      }
    ;

  /**
   * Pull all films from the film list that match the genre using jsonPath
   * and splice the range out.
   * Paging is not implementated (021212)
   */

  function extractData(obj, callback) {
    var key = Object.keys(obj)[0]
      , bin = obj[bin]
      , val = obj[key]
      , data
      ;

    if (val === 'All') {
      sortedData = films.sort(function(a, b) { return b['id'] - a['id']; } );
      callback(sortedData);
    } else {
      if (key === 'year') {
        data = core.jsonPath(library, '$..films[?(@.' + key + '===' + val + ')]');
      } else {
        if (key === 'director' || key === 'writer' || 'genre') {
          data = core.jsonPath(library, '$..films[?(@.' + key + '.indexOf("'+ val +'") > -1)]');
        } else {
          data = core.jsonPath(library, '$..films[?(@.' + key + '==="' + val + '")]');
        }
      }
      if (data) {
        sortedData = data.sort(byTitle);
        callback(sortedData);
      } else {
        callback(false);
      }
    }
  }

  /*
   * Retrieve the URL object (contains path and query information),
   * extract the relevant data from the list of films
   * and send that data as JSON down the wire.
   */

  return function get(req, res) {
    var url = core.getUrlObj(req), obj = {};
    if (url.query.genre !== undefined) obj.genre = url.query.genre;
    if (url.query.year !== undefined) obj.year = url.query.year;
    if (url.query.writer !== undefined) obj.writer = url.query.writer;
    if (url.query.director !== undefined) obj.director = url.query.director;
    extractData(obj, function(data) {
      if (data) {
        if (url.query.api) {
          var obj = {};
          obj.films = data;
          res.send(JSON.stringify(obj));
        } else {
          res.send(JSON.stringify(data));
        }
      } else {
        res.send(data);
      }
    });
  };

}