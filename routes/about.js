// About page

exports = module.exports = about;

function about(app) {
  return function about(req, res) {
    res.render('about', {menu: app.library.menu});
  }
}