// 404 page

exports = module.exports = fourohfour;

function fourohfour(app) {
  return function fourohfour(req, res) {
    res.render('fourohfour', {filmCount: app.library.count});
  }
}