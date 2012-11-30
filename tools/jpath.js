var core = require('core')

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
    genre: 'Science Fiction and Fantasy',
    dateAdded: 'Fri Sep 07 2012 20:25:10 GMT+0000 (UTC)',
    numberOfSpots: 5640
  }
]

//var data = core.jsonPath(arr, '$..'+ type + '[?(@._id==="' + item + '")]')
var data = core.jsonPath(arr, '$..[?(@.genre==="Science Fiction and Fantasy")]')
console.log(data);
