// Category page

exports = module.exports = category;

function category(app) {
  return function category(req, res) {
    res.render('category', {filmCount: app.library.count});
  }
}