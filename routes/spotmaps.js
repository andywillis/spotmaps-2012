/**
 * This module listens to incoming spotmap requests
 * and sends the appropriate spotmaps as JSON data
 * down the wire.
 */

var arr = [
  {
    id: '001',
    title: 'Albert Nobbs',
    filename: 'Albert_Nobbs.png',
    director: 'García, Rodrigo',
    writer: ['Close, Glenn', 'Banville, John'],
    dateAdded: 'Thu Sep 06 2012 20:25:10 GMT+0000 (UTC)',
    numberOfSpots: 6540
  },
  {
    id: '002',
    title: 'Dressed to Kill',
    filename: 'Dressed_to_Kill.png',
    director: 'de Palma, Brian',
    writer: 'de Palma, Brian',
    dateAdded: 'Fri Sep 07 2012 20:25:10 GMT+0000 (UTC)',
    numberOfSpots: 6600
  },
  {
    id: '003',
    title: 'Shame',
    filename: 'Shame.png',
    director: 'McQueen, Steve',
    writer: 'McQueen, Steve',
    dateAdded: 'Wed Sep 05 2012 20:25:10 GMT+0000 (UTC)',
    numberOfSpots: 6360
  },
  {
    id: '004',
    title: 'Haywire',
    filename: 'Haywire.png',
    director: 'Soderbergh, Steven',
    writer: 'Dobbs, Lem',
    dateAdded: 'Sat Sep 08 2012 20:25:10 GMT+0000 (UTC)',
    numberOfSpots: 5820
  },
  {
    id: '005',
    title: 'Silent Running',
    filename: 'Silent_Running.png',
    director: 'Trumball, Douglas',
    writer: ['Deric Washburn','Michael Cimino','Steven Bochco'],
    dateAdded: 'Fri Sep 07 2012 20:25:10 GMT+0000 (UTC)',
    numberOfSpots: 5640
  }
]

exports.latest = function(req, res) {

  res.send(JSON.stringify(arr));
  
};