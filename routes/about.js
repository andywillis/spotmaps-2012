// About page

exports = module.exports = about;

function about(app) {
  return function about(req, res) {
    res.render('about', {filmCount: app.library.count});
  }
}