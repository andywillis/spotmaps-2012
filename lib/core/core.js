var querystring = require('querystring')
  , url = require('url')

var core = module.exports = {};

// Clean object

core.dateStamp = function(delimiter) {
  var now = new Date(), stamp = '', arr = ['getFullYear', 'getMonth', 'getDate', 'getHours', 'getMinutes', 'getSeconds']
  for (var i = 0, len = arr.length; i < len; i++) {
    var el = arr[i]
      , delimiter = (i === len - 1) ? '' : delimiter || ''
      , digit = (el === 'getMonth') ? (now[el]()+1).toString() : now[el]().toString()
      , dLen = digit.length
    if (dLen > 2 ) digit = digit.substring(dLen-2, dLen)
    if (dLen < 2 ) digit = '0' + digit
    stamp += digit + delimiter
  }
  return stamp
}

core.wipe = function(obj) {
  for (var p in obj) {
    if (Object.hasOwnProperty(p)) {
      delete p
    }
  }
  return obj
}

/**
 * contenttypes
 */

core.contentTypes = {
    ase:  'application/illustrator'
  , css:  'text/css'
  , gif:  'image/gif'
  , htm:  'text/html'
  , html: 'text/html'
  , ico:  'image/vnd.microsoft.icon'
  , jpg:  'image/jpeg'
  , js:   'text/plain'
  , log:  'text/plain'
  , png:  'image/png'
  , rss:  'text/plain'
  , swf:  'application/x-shockwave-flash'
  , ttf:  'application/x-font-ttf' 
  , txt:  'text/plain'
  , woff: 'application/x-font-woff'
  }

/**
 * Return a URL object
 */

core.getUrlObj = function(req) {
  var obj = {}
    , _url = url.parse(req.url)
    , pathname = _url.pathname
    , query = _url.query
    , year = _url.year
    , writer = _url.writer
    , director = _url.director
    , extension = pathname.split('.').reverse()[0]

  obj.pathname = pathname
  obj.query = {}
  obj.contentType = core.contentTypes[extension]
  if (query) {
    query = query.split('&')
    for(var i = 0, len = query.length; i < len; i++) {
      var arr = query[i].split('=')
      obj.query[arr[0]] = core.decode(arr[1][0].toUpperCase() + arr[1].slice(1))
    }
  }
  return obj
}

/**
 * escape HTML
 */

core.escapeHTML = function(html){
  return String(html)
    .replace(/&(?!\w+;)/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
};

/**
 * merges objects
 */
 
core.merge = function(a, b){
  if (a && b) {
    for (var key in b) {
      a[key] = b[key];
    }
  }
  return a;
};

/**
 * rfc4122 compliant UUID creator
 */

core.getUUID = function getUUID() {
	var id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = Math.random()*16|0,
					v = (c == 'x') ? r : (r&0x3|0x8)

			return v.toString(16);
	})
	return id
}

core.toType = function(x) { return ({}).toString.call(x).match(/\s([a-zA-Z]+)/)[1].toLowerCase() }

/**
 * get random number between 0 and num
 */

core.getNumberInRange = function getNumberInRange(num) {
	return Math.random()*num|0
}

core.fromPrototype = function fromPrototype(prototype, object) {
	var newObject = Object.create(prototype);
 	for (var prop in object) {
		if (object.hasOwnProperty(prop)) {
			newObject[prop] = object[prop];      
		}
	}
	return newObject;
}

/**
 * clear the console
 */

core.clear = function clear() {
	console.log('\033[2J')
}

/**
 * is x an object?
 */
 
 core.isObject = function isObject(x) {
	var query = (typeof x === 'object' && x !== null && x !== 'undefined' && x !== '') ? true : false
	return query
}

/**
 * returns the name of the current module
 */

core.getModuleName = function getModuleName(path) {
	var arr = path.split('\\')
	,	name = arr[arr.length-1].split('.')[0]
	return name
}

/**
 * pads out a string with x
 */

core.pad = function pad(str, size) {
	for (var lop = 0, len = size; lop < len; lop ++) {
		str += '0'
	}
	return str
}

/**
 * returns formatted percent
 */

core.percent = function percent(sum) {
	return Math.round(sum*100)*100/100 + '%'
}

/**
 * records the time a function takes to run
 */

core.timeFn = function timeFn(fn, measurement, callback) {
	var end, start, time, text
	start = new Date().getTime()
	fn()
	end = new Date().getTime()

	switch( measurement ) {
		case 's':
			time = (end - start) / 1000
			text = 'Completed in: ' + time + ' seconds.'
			callback(text)
			break;
		default:
			time = (end - start)
			text = 'Completed in: ' + time + ' milliseconds.'
			callback(text)
			break;
	}
}

core.asFormattedArray = function asFormattedArray(string, delimiter) {
	var array = []
	array = string.replace(/\s*,\s*/g, ',').split(delimiter)
	return array
}

/**
 * gets the properties of the object
 */

core.getProps = function getProps (obj) {
	return Object.getOwnPropertyNames(obj).sort()
}

/**
 * show obj properties
 */

core.getExtProps = function getExtProps(name, obj, maxLevel, show) {
	var html = '<h1>' + name.toUpperCase() + '</h1>'
	var level = 0
	var indent = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'
	var lop = function(obj, level) {
		for (prop in obj) {
			var objType = typeof obj[prop]
			switch(objType) {
				case 'object':
					if (show.indexOf(objType) >= 0 && obj[prop] !== null && Object.keys(obj[prop]).length > 0) {
						for (var el = 0; el < level; el++) html += indent
						html += '<span><b>' + prop +'</b></span><br/>'
						if (level < maxLevel) lop(obj[prop], level+1)
					}
					break;
				case 'string':
					if (show.indexOf(objType) >= 0) {
						for (var el = 0; el < level; el++) html += indent
							html += '<span>' + prop + ': ' + obj[prop] + '</span><br/>'
						}
					break;
				case 'function':
					if (show.indexOf(objType) >= 0) {
						for (var el = 0; el < level; el++) html += indent
							html += '<span><i>' + prop +'</i></span><br/>'
						}
					break;
			}
		}
	}
	lop(obj, level)
	return html
}

/**
 * Dedupes an array
 */

Array.prototype.dedupe = function dedupe() {
	
	var arr = this
		,	index = 0
		,	arrlen = arr.length
		;

	while ( index < arrlen ) {

		if ( arr[ index ] === arr[index+1] ) {
			arr.splice( index + 1, 1 );
			arrlen--
		} else {
			index ++;
		};

	};

	return arr;
};

Object.defineProperty( Array.prototype, 'dedupe', { enumerable: false } );

/**
 * Dedupes an array
 */

core.dedupe = function(arr){
	var arr = arr.sort()
		,	index = 0
		,	arrLen = arr.length
		;

	while ( index < arrLen ) {
		if ( arr[index] === arr[index + 1] ) {
			arr.splice(index + 1, 1);
			arrLen--
		} else {
			index ++;
		};
	};
	return arr;
}

/* JSONPath 0.8.3 - XPath for JSON
 *
 * Copyright (c) 2007 Stefan Goessner (goessner.net)
 * Licensed under the MIT (MIT-LICENSE.txt) licence.
 */
core.jsonPath = function(obj, expr, arg) {
   var P = {
      resultType: arg && arg.resultType || "VALUE",
      result: [],
      normalize: function(expr) {
         var subx = [];
         return expr.replace(/[\['](\??\(.*?\))[\]']|\['(.*?)'\]/g, function($0,$1,$2){return "[#"+(subx.push($1||$2)-1)+"]";})  /* http://code.google.com/p/jsonpath/issues/detail?id=4 */
                    .replace(/'?\.'?|\['?/g, ";")
                    .replace(/;;;|;;/g, ";..;")
                    .replace(/;$|'?\]|'$/g, "")
                    .replace(/#([0-9]+)/g, function($0,$1){return subx[$1];});
      },
      asPath: function(path) {
         var x = path.split(";"), p = "$";
         for (var i=1,n=x.length; i<n; i++)
            p += /^[0-9*]+$/.test(x[i]) ? ("["+x[i]+"]") : ("['"+x[i]+"']");
         return p;
      },
      store: function(p, v) {
         if (p) P.result[P.result.length] = P.resultType == "PATH" ? P.asPath(p) : v;
         return !!p;
      },
      trace: function(expr, val, path) {
         if (expr !== "") {
            var x = expr.split(";"), loc = x.shift();
            x = x.join(";");
            if (val && val.hasOwnProperty(loc))
               P.trace(x, val[loc], path + ";" + loc);
            else if (loc === "*")
               P.walk(loc, x, val, path, function(m,l,x,v,p) { P.trace(m+";"+x,v,p); });
            else if (loc === "..") {
               P.trace(x, val, path);
               P.walk(loc, x, val, path, function(m,l,x,v,p) { typeof v[m] === "object" && P.trace("..;"+x,v[m],p+";"+m); });
            }
            else if (/^\(.*?\)$/.test(loc)) // [(expr)]
               P.trace(P.eval(loc, val, path.substr(path.lastIndexOf(";")+1))+";"+x, val, path);
            else if (/^\?\(.*?\)$/.test(loc)) // [?(expr)]
               P.walk(loc, x, val, path, function(m,l,x,v,p) { if (P.eval(l.replace(/^\?\((.*?)\)$/,"$1"),v[m],m)) P.trace(m+";"+x,v,p); });
            else if (/^(-?[0-9]*):(-?[0-9]*):?([0-9]*)$/.test(loc)) // [start:end:step]  phyton slice syntax
               P.slice(loc, x, val, path);
            else if (/,/.test(loc)) { // [name1,name2,...]
               for (var s=loc.split(/'?,'?/),i=0,n=s.length; i<n; i++)
                  P.trace(s[i]+";"+x, val, path);
            }
         }
         else
            P.store(path, val);
      },
      walk: function(loc, expr, val, path, f) {
         if (val instanceof Array) {
            for (var i=0,n=val.length; i<n; i++)
               if (i in val)
                  f(i,loc,expr,val,path);
         }
         else if (typeof val === "object") {
            for (var m in val)
               if (val.hasOwnProperty(m))
                  f(m,loc,expr,val,path);
         }
      },
      slice: function(loc, expr, val, path) {
         if (val instanceof Array) {
            var len=val.length, start=0, end=len, step=1;
            loc.replace(/^(-?[0-9]*):(-?[0-9]*):?(-?[0-9]*)$/g, function($0,$1,$2,$3){start=parseInt($1||start);end=parseInt($2||end);step=parseInt($3||step);});
            start = (start < 0) ? Math.max(0,start+len) : Math.min(len,start);
            end   = (end < 0)   ? Math.max(0,end+len)   : Math.min(len,end);
            for (var i=start; i<end; i+=step)
               P.trace(i+";"+expr, val, path);
         }
      },
      eval: function(x, _v, _vname) {
         try { return $ && _v && eval(x.replace(/@/g, "_v")); }
         catch(e) { throw new SyntaxError("jsonPath: " + e.message + ": " + x.replace(/@/g, "_v").replace(/\^/g, "_a")); }
      }
   };

   var $ = obj;
   if (expr && obj && (P.resultType == "VALUE" || P.resultType == "PATH")) {
      P.trace(P.normalize(expr).replace(/^\$;/,""), obj, "$");
      return P.result.length ? P.result : false;
   }
}

core.encode = function(string) {
   return encodeURIComponent(string)
}

core.decode = function(string) {
   return decodeURIComponent(string.replace(/\+/g,  " "));
}