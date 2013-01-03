var fs = require('fs')
  , core = require('../lib/core/core')
  ;

exports = module.exports = count;

function sortObject(obj, type, listLen) {
  var sortArr = [], key, keys, temp = {}, i, l;
  if (type === 'key') {
    keys = Object.keys(obj).sort();
    for (i = 0, l = listLen; i < l; i ++) {
      key = keys[i];
      temp[key] = obj[key];
    }
  }
  if (type === 'value') {
    for (key in obj) { sortArr.push(obj[key]); }
    sortArr.sort(function(a, b) { return b.toString() - a.toString(); });
    for (i = 0, l = listLen; i < l; i ++) {
      for (key in obj) { if (obj[key] === sortArr[i]) temp[key] = obj[key]; }
    }
  }
  return temp;
}

function count(films, category, type, listLen) {
  var filmCount = {}, item, i, ii, l, ll, cat;
  for (i = 0, l = films.length; i < l; i++) {
    cat = films[i][category];
    if (core.toType(cat) === 'array') {
      for (ii = 0, ll = cat.length; ii < ll; ii++) {
        item = cat[ii];
        if (filmCount[item]) filmCount[item]++;
        else filmCount[item] = 1;
      }
    }

    /*
     * Note that titles are treated differently here. Instead of a count added as value,
     * the id of the film is added instead. This id is picked up by the listTemplate,
     * and also the app.js that checks for listItem clicks.
     */

    else {
      if (category !== 'title') {
        if (filmCount[cat]) filmCount[cat]++;
        else filmCount[cat] = 1;
      } else {
        filmCount[cat] = films[i].id;
      }
    }
  }
  listLen = (listLen === null) ? Object.keys(filmCount).length : listLen;
  return sortObject(filmCount, type, listLen);
}