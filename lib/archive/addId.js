var fs = require('fs')
  , data = require('../data/_films')
  , id = 1
  , films = data.films

for (var f in films) {
  films[f].id = id;
  id++
}

fs.writeFile('../data/films.js', JSON.stringify(data, null, '\t'), 'utf-8')

console.log('Data saved');