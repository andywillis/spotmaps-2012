var core = require('./core/core')
  , fs = require('fs')
  ;

var libraryImport;

exports = module.exports = loadLibrary;

function loadLibrary(app, options) {
  app.dbox.get(core.decode(app.libraryLocation), function (status, data, metadata) {

    libraryImport = JSON.parse(data.toString());

    app.library.films.length = 0;

    for (i = 0, len = libraryImport.films.length; i < len; i++) {
      film = libraryImport.films[i];
      if (film.display === true) app.library.films.push(film);
    }

    app.library.menu = require(app.ROOT  + '/lib/count')(app.library.films, 'genre', 'value', 12);
    app.library.genres = require(app.ROOT + '/lib/count')(app.library.films, 'genre', 'key', null);
    app.library.directors = require(app.ROOT + '/lib/count')(app.library.films, 'director', 'key', null);
    app.library.writers = require(app.ROOT + '/lib/count')(app.library.films, 'writer', 'key', null);
    app.library.years = require(app.ROOT + '/lib/count')(app.library.films, 'year', 'key', null);
    app.library.titles = require(app.ROOT + '/lib/count')(app.library.films, 'title', 'key', null);

    console.log('Library loaded.'.green);

    /*
     * Update the RSS feed if the option is selected through the admin page.
     */

    if (options && options.updateRSS) {
      updateList = core.jsonPath(app.library, '$..films[?(@.updated===true)]');
      len = updateList.length;
      number = (len === 1) ? updateList[len - 1].id : updateList[len - 1].id - updateList[len - 2].id;
      rssTemplate = fs.readFile(app.ROOT + '/views/includes/rssTemplate.html', 'utf-8', function(err, template) {
        if (err) {
          console.log(err);
        } else {
          content = template.replace('#{number}', number);
          fs.writeFile(app.ROOT + '/public/rss/spotmaps.rss', content, 'utf-8', function() {
            console.log('RSS feed updated.');
          });
        }
      });
    }

  });
}