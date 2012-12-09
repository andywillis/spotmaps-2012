// Home page

exports = module.exports = show;

function show(app) {

  return function show(req, res) {

    var library = app.library
      , core = require('../lib/core/core')
      , url = core.getUrlObj(req), obj = {}
      , data = core.jsonPath(library, '$..films[?(@.id===' + url.query.id + ')]')[0]

    res.render('show', {filmCount: app.library.count, title: data.title, year: data.year });
  }

}