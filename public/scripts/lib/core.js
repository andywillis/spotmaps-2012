(function(window) {

  var core = {}

  // Returns a sorted list of available HTML5 and CSS3 features via Modernizr
  core.showModernizr = function() {
    var list = []
      , args = arguments[0]
      , arg = (typeof args === 'undefined' || args) ? true : false
    for (var p in Modernizr) { if (Modernizr[p] == arg) list.push(p) }
    return list.sort().join(', ')
  }

  // Improved type evaluator
  core.toType = function(x) { return ({}).toString.call(x).match(/\s([a-zA-Z]+)/)[1].toLowerCase() }

  // Entended element creation function that returns either a docfrag
  // or a DOM element with classes and ids set.
  core.create = function () { 
    var args = arguments[0], el, del = ['type','el']
    if (args.type === 'el') {
      el = document.createElement(args.el)
      for (var p in args) { if (!~del.indexOf(p)) { el.setAttribute(p, args[p]) } }
    } else {
      el = document.createDocumentFragment()
    }
    return el
  }
  
  // Returns element by id
  core.get = function (el) {
    return document.getElementById(el)
  }

  // Accepts an filename, loads the image
  // and returns its data-url data
  core.getImageDataURL = function(url, success, error) {
    var data, canvas, ctx;
    var img = new Image();
    img.onload = function () {
      console.log(img.src);
        canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
      try {
        data = canvas.toDataURL();
        success({image:img, data:data});
      } catch(e){
        error(e);
      }
    }
    try {
      img.src = url;
    } catch(e){
      error(e);
    }
  }

  // Attach the core to window
  if (!window.core) window.core = core;

}(window))