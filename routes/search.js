// Search page

exports = module.exports = search;

function search(app) {
  return function search(req, res) {
    res.render('search', {menu: app.library.menu});
  }
}