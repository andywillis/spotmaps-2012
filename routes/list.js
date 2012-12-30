// Home page

exports = module.exports = list;

function list(app) {
  return function list(req, res) {
    res.render('list', {
      menu: app.library.menu,
      genres: JSON.stringify(app.library.genres),
      directors: JSON.stringify(app.library.directors),
      writers: JSON.stringify(app.library.writers),
      years: JSON.stringify(app.library.years)
    });
  }
}