(function(window) {

  var core = {}

  core.nbLoop3 = function() {
    
    var args = arguments[0]
      , arr = args.arr
      , len = arr.length
      , out = args.out || []
      , params = args.params
      , callback = args.cb
      , fn = args.fn
      , el = 0
      
    if (arr && core.toType(arr) === 'array') { len = arr.length } else { throw new Error('No array') }
    if (!args.fn) { throw new Error('No working function specified') }
    if (!args.fn) { throw new Error('No working function specified') }
    
    (function iterator (el,arr,fn,out,params,callback) {
      //console.log(el,arr,fn,out,params,callback)
      // Run passed function with next iteration of array
      fn({
        el: arr[el],
        i: el,
        out: out,
        params: params,
        cb: function(out, iteration, params) {
          // If the end of the array is found, callback!
          if (iteration === len - 1) callback(++el, out)
          // Otherwise, call the iterator again.
          el++
          if (el < len) setTimeout(function(){iterator(el,arr,fn,out,params,callback)}, 0)
        }
      })
    }(el,arr,fn,out,params,callback))

  }

  // Checks to see if the URL exists in cache
  core.UrlExists = function(url, callback)
  {
    var http = new XMLHttpRequest();
    http.open('HEAD', url);
    http.onreadystatechange = function() {
      if (this.readyState == this.DONE) {
        callback(this.status);
      }
    };
    http.send();
  }

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
  // or a DOM element with classes and ids set where appropriate.
  core.create = function () { 
    var args = arguments[0], el, del = ['type','el']
    if (args.type === 'text') return document.createTextNode(args.text)
    if (args.type === 'frag') return document.createDocumentFragment()
    el = document.createElement(args.el)
    for (var p in args) { if (!~del.indexOf(p)) { el.setAttribute(p, args[p]) } }
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