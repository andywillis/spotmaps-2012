var core = require('core')

// Category page

exports = module.exports = category;

function category(app) {
  
  return function category(req, res) {

    function capitalise(str) {
      return core.decode(str[0].toUpperCase() + str.slice(1))
    }

    var core = require('../lib/core/core')
      , url = core.getUrlObj(req), obj = {}
      , category = url.pathname.split('/')[1]
      , value = url.pathname.split('/')[2]
      , label = capitalise(category) + ': ' + capitalise(value)

    res.render('category', { filmCount: app.library.count, label: label });
  
  }

}