// Home page

exports = module.exports = api;

function api(app) {
  return function api(req, res) {
    res.render('api', { menu: app.library.menu, genres: app.library.genres });
  };
}