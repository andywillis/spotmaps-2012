var core = require('core')
  , querystring = require('querystring')
  , url = require('url')

var limit = 5

/**
 * This module listens to incoming spotmap requests
 * and sends the appropriate spotmaps as JSON data
 * down the wire.
 */

var genres = [
  'Action and Adventure',
  'Animation',
  'Comedy',
  'Crime',
  'Documentary',
  'Drama',
  'Family',
  'Horror',
  'Period and Historical',
  'Science Fiction and Fantasy',
  'Thriller',
  'Western'
]

var arr = [
  {
    id: '001',
    title: 'Albert Nobbs',
    filename: 'Albert_Nobbs',
    director: 'García, Rodrigo',
    writer: ['Close, Glenn', 'Banville, John'],
    genre: 'Drama',
    dateAdded: 'Thu Sep 06 2012 20:25:10 GMT+0000 (UTC)',
    numberOfSpots: 6540
  },
  {
    id: '002',
    title: 'Dressed to Kill',
    filename: 'Dressed_to_Kill',
    director: 'de Palma, Brian',
    writer: 'de Palma, Brian',
    genre: 'Thriller',
    dateAdded: 'Fri Sep 07 2012 20:25:10 GMT+0000 (UTC)',
    numberOfSpots: 6600
  },
  {
    id: '003',
    title: 'Shame',
    filename: 'Shame',
    director: 'McQueen, Steve',
    writer: 'McQueen, Steve',
    genre: 'Drama',
    dateAdded: 'Wed Sep 05 2012 20:25:10 GMT+0000 (UTC)',
    numberOfSpots: 6360
  },
  {
    id: '004',
    title: 'Haywire',
    filename: 'Haywire',
    director: 'Soderbergh, Steven',
    writer: 'Dobbs, Lem',
    genre: 'Thriller',
    dateAdded: 'Sat Sep 08 2012 20:25:10 GMT+0000 (UTC)',
    numberOfSpots: 5820
  },
  {
    id: '005',
    title: 'Silent Running',
    filename: 'Silent_Running',
    director: 'Trumball, Douglas',
    writer: ['Deric Washburn','Michael Cimino','Steven Bochco'],
    genre: 'Science fiction and fantasy',
    dateAdded: 'Fri Sep 07 2012 20:25:10 GMT+0000 (UTC)',
    numberOfSpots: 5640
  }
]

//var data = core.jsonPath(arr, '$..[?(@.genre==="Science Fiction and Fantasy")]')

function getUrlObj(req) {
  var obj = {}, q
  obj.path = url.parse(req.url).pathname
  obj.query = {}
  q = url.parse(req.url).query.split('&')
  for(var i = 0, len = q.length; i < len; i++) {
    var arr = q[i].split('=')
    obj.query[arr[0]] = core.decode(arr[1][0].toUpperCase() + arr[1].slice(1))
  }
  return obj
}

function extractData(obj, callback) {
  if (obj.genre === 'All') {
    callback(arr.slice(0, limit))
  } else {
    var data = core.jsonPath(arr, '$..[?(@.genre==="' + obj.genre + '")]')
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
exports.latest = function(req, res) {
  getUrlObj(req)
  extractData({
    genre: 'all'
  }, function(data) {
    res.send(JSON.stringify(data))
  })
}
*/

module.exports = function(req, res) {
  var url = getUrlObj(req)
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