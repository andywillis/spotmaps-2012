// Category page

exports = module.exports = category;

function category(app) {
  
  return function category(req, res) {

    function capitalise(str) {
      return core.decode(str[0].toUpperCase() + str.slice(1));
    }

    var core = require('../lib/core/core')
      , url = core.getUrlObj(req), obj = {}
      , cat = url.pathname.split('/')[1]
      , value = url.pathname.split('/')[2]
      , label = capitalise(cat) + ': ' + capitalise(value)
      ;

    res.render('category', { menu: app.library.menu, label: label });
  
  };

}