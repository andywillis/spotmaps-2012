// Home page

exports = module.exports = index;

function index(app) {
  return function index(req, res) {
    res.render('index', {menu: app.library.menu});
  }
}