$(document).ready(function () {

  (function () {

    var 
        // jQuery
        $win = $(window)
      , $document = $(document)
      , $left = $('#left')
      , $right = $('#right')
      , $info = $('#info')
      , $content = $('#content')
      , $genre = $('#menu-genre .menuItem')
      , $genreList = $('nav ul ul')
      , $loader = $('div#loader')
      , $alphabet = $('.alphabet')

      // Regex
      , staticRegex = /(^\/(list|search|about)+$)/
      , jsonRegex = /(^\/$)|(^\/(home|genre|year|director|writer)+)/
      , showRegex = /(^\/show)/

      // Template
      , spotmapTemplate = _.template($('#spotmapTemplate').html())
      , listTemplate = _.template($('#listTemplate').html())

      // Routing
      , pathname = window.location.pathname
      , route = '/' + pathname.split('/')[1]
      , menu = pathname.split('/')[1]
      , staticMatch = staticRegex.test(pathname)
      , jsonMatch = jsonRegex.test(pathname)
      , showMatch = showRegex.test(pathname)
      , type = (route === '/') ? 'all' : pathname.replace(route + '/','')
      , getQuery = (route === '/') ? 'genre=all' : [route.slice(1) + '=', type].join('')

      // Other
      , imageData = undefined
      , slice = Array.prototype.slice
      , imagesLoadedCheck, listCategory = 'genre', list
      , page = 0, pageRange = 10, pageStart = page * pageRange, pageEnd = (page + 1) * pageRange
      , categories = ['genres', 'directors', 'writers', 'years']

    /*
     * For each film in the film list create a spotmap div, image and notes
     * and append them to the group div. The function makes use of the 'create'
     * and 'get' functions from the core module which allows elements and their
     * ids and attributes to be created in one statement.
     * 
     * Native Javascript DOM coding is used instead of jQuery because it's 
     * slightly more efficient, and underscore templating has been implemented.
     */

    function processData(spotmapList) {

      var group = core.create({ el: 'div', class: 'group' })
        , frag = core.create({ type: 'frag' })
        , br = core.create({type: 'el', el: 'br'})

      spotmapList.forEach(function(map) {

        if (map.display) {
          // Create new elements
          var frame = core.create({ el: 'div', class: 'frame clearfix' })
            , br = core.create({type: 'el', el: 'br'})

          // Format the map information labels and data.
          map.directorLabel = map.director.length > 1 ? 'Directors' : 'Director'
          map.writerLabel = map.writer.length > 1 ? 'Writers' : 'Writer'
          map.genreLabel = map.genre.length > 1 ? 'Genres' : 'Genre'
          map.director = map.director.join('</a><br/><a>')
          map.writer = map.writer.join('</a><br/><a>')
          map.genre = map.genre.join('</a><br/><a>')
          map.minutes = map.numberOfSpots/60
          map.src = '/static/images/' + map.filename
          map.ase = '/static/ase/' + map.title + '.ase'
          map.map = '/static/hex/' + map.title + '.hex'

          // Push the data into the template and render it.
          frame.innerHTML = spotmapTemplate({map: map})
          frag.appendChild(frame)
          frag.appendChild(br)
          group.appendChild(frag)          
        }

      })
  
      return group
    }

    /*
     * Picks up the hex imageData stored in the global var that
     * is loaded when showMatch (the test for the show route) is true
     * and loops over it building a canvas which is then returned.
     */

    function createSpotmap(size, callback) {
      if (imageData) {
        var spot = { size: size, border: 'rgba(0,0,0,1)', borderWidth: 0.2 }
          , xpos = 0, ypos = 0
          , data = imageData
          , len = data.length
          , cwidth = spot.size*60
          , cheight = (spot.size*len/6)/60
          , canvas = core.create({ el: 'canvas', width: cwidth, height: cheight })
          , context = canvas.getContext('2d')
          , entry
          , count = 0

        for (var i = 0; i < len; i+=6) {

          var r = parseInt(data.slice(i, i+2), 16)
            , g = parseInt(data.slice(i+2, i+4), 16)
            , b = parseInt(data.slice(i+4, i+6), 16)

          entry = [r, g, b]

          if (count % 60 === 0 && count !== 0) {
            ypos = ypos + spot.size
            xpos = 0
            count = 0
          }
          
          context.beginPath();
          context.rect(xpos,ypos,spot.size,spot.size)
          context.fillStyle = 'rgba(' + entry + ', 255)'
          context.fill()
          context.lineWidth = spot.borderWidth
          context.strokeStyle = spot.border
          context.stroke()
          xpos = xpos + spot.size
          count++
        }
        callback(null, {data: canvas, size: [cwidth, cheight]})
      } else {
        callback('Error: image hex data not found - possible filename mismatch. Please contact the site administrator.')
      }

    }

    /*
     * Immediately invoked function to pull the JSON film data
     * from the server and run it through the processData function
     * as soon as the page loads.
     */

    function getData(url, callback) {
      $.ajax({
        type: 'GET',
        url: url,
        success: function(data) {
          if (data) {
            callback(null, data)
          } else {
            callback('No data.');
          }
        },
        error: function(err) {
          console.log(err);
        }
      })
    }

    /*
     * Either grab the image data from the imageData var, or
     * load it in from the server. Call convertAndDisplay().
     */    

    function getCanvasData (size) {
      
      var href = window.location.href.split('?')[1]
        , id = href.split('=')[1]
        , url = '/bin/?id=' + id
        , size = size || 8

      if (imageData) {
        convertAndDisplay(size)
      } else {
        $loader.css({'visibility': 'visible'})
        getData(url, function(err, data) {
          imageData = data
          if (err) console.log(err)
          else {
            convertAndDisplay(size)
            $loader.css({'visibility': 'hidden'})
          }
        })
      }
     }

     /*
      * Use the imageData to build a new canvas, use that data for a new
      * image and append it to the content div.
      */

    function convertAndDisplay(size) {
      createSpotmap(size, function(err, canvas) {
        if (err) {
          console.log(err);
        } else {
          img = core.create({
            el:'img',
            class: 'canvas',
            src: canvas.data.toDataURL(),
            width: canvas.size[0],
            height: canvas.size[1]
          })
          $content.empty().append(img)
        }
      })
    }

    /*
     * If the staticMatch.
     */

    if (staticMatch) {
      if (menu === 'list') {
        var list = {}, category
        for (var i = 0, len = categories.length; i < len; i++) {
          category = categories[i]
          list[category] = JSON.parse($('#' + category).html())
        }
        listCategory = 'genre'
        $('.alphabetItem[data-letter="a"]').addClass('selected')
        $('#list').html(listTemplate({type: listCategory, obj: list.genres, letter: 'a'}))
      }
    }

    /*
     * If the showRoute is true load the spotmap hex data and
     * preselect the 4 button as the default setting.
     */

    if (showMatch) {
      $('.size').filter(function(){ return $(this).text() === '8' }).addClass('selected')
      getCanvasData();
    }

    /*
     * If the route is a json match run the buildGroup function.
     */

    if (jsonMatch) buildGroup();

    /*
     * Get the data and pin it to the group div.
     * Attach the group div to the content div.
     * While the images are loading, display the loader.
     */

    function buildGroup() {
      var url = '/json/?' + getQuery
      getData(url, function(err, data) {
        if (err) console.log(err)
        else {
          parsedJson = JSON.parse(data);
          var len = parsedJson.length, pageStop = pageEnd < len ? (pageRange*(page+1)) : len
          $info.html(pageStart+1 + ' to ' + pageStop + ' of ' + (len))
          if (pageStart >= pageRange) $left.css({'visibility': 'visible'});
          if (pageStart <= 0) $left.css({'visibility': 'hidden'});
          if (pageEnd <= len && len > pageRange) $right.css({'visibility': 'visible'});
          if (pageEnd >= len) $right.css({'visibility': 'hidden'});
          var group = processData(parsedJson.slice(pageStart, pageEnd))
          $content.empty()
          $content.append(group)
          var $images = slice.call($('img.spotmap'))
          $loader.css({'visibility': 'visible'})
          imagesLoadedCheck = setInterval(function(){ checkImages($images) }, 500)
        }
      })      
    }

    /*
     * If the images are still loading, display the loader
     */

    function checkImages(imageList) {
      var count = imageList.length;
      imageList.forEach(function(image){
        if (image.naturalHeight !== 0) {
          count--
          if (count === 0) {
            $loader.css({'visibility': 'hidden'})
            clearInterval(imagesLoadedCheck)
          }
        }
      })
    }

    /*
     * Next page
     */

    $document.on('click', '#right', function () {
      page++, pageStart = page * pageRange, pageEnd = (page + 1) * pageRange
      buildGroup();
    })

    /*
     * Previous page
     */

    $document.on('click', '#left', function () {
      page--, pageStart = page * pageRange, pageEnd = (page + 1) * pageRange
      buildGroup();
    })

    /*
     * Highlight correct menu item
     */

    $('#menu li.menu-selected').removeClass('menu-selected')
    $('#menu li#menu-' + menu).addClass('menu-selected')

    /*
     * Add email address
     */

    if (menu === 'about') $('.contact').attr('href', 'mailto:awillis@lavabit.com')

    /*
     * Update RSS
     */
     
    $(document).on('click', '#updateRSS', function(event) {
      event.preventDefault()
      url = core.unshake(47,56,100,109,49,110,47,117,112,100,97,116,101,82,83,83)
      getData(url, function(err, data) {
        $('#rssUpdated').fadeIn()
      })
    })

    /*
     * Hide the menu on item.onClick. This doesn't happen 
     * automatically as it's a CSS-only menu.
     */

    $document.on('click', '#menu-genre .menuItem', function () { 
      $genreList.css({'display': 'none'}) 
    })

    /*
     * Redirect if user clicks on a spotmap category
     */

    $(document).on('click', '.value a', function () { 
      var labelType = ['/', this.parentNode.className.split(' ')[0], '/'].join('')
      window.location = labelType + this.innerHTML
    })

    /*
     * Display the spotmap canvas
     */

    $(document).on('click', '.spotmap', function () {
      window.location = '/show/?id=' + this.id
    })

    /*
     * Update canvas when size is changed.
     */

    $(document).on('click', '.size', function () {
      $('.size').removeClass('selected')
      var size = this.innerHTML;
      $(this).addClass('selected')
      convertAndDisplay(parseInt(size))
    })

    /*
     * Updates the list screen when a category is selected
     */

    $(document).on('click', '.listLabel .formSpan', function () {
      $('.listLabel .formSpan').removeClass('selected')
      $(this).addClass('selected')
      listCategory = this.innerHTML;
      if (listCategory === 'genre' || listCategory === 'year') {
        $alphabet.hide()
      } else {
        $alphabet.show()
      }
      $('#list').html(listTemplate({type: listCategory, obj: list[listCategory + 's'], letter: 'a'}))
    })

    /*
     * Update the list screen when a letter of the alphabet is chosen.
     */

    $(document).on('click', '.alphabetItem', function () {
      var letter = $(this).html().toLowerCase()
      $('.alphabetItem').removeClass('selected')
      $(this).addClass('selected')
      $('#list').html(listTemplate({type: listCategory, obj: list[listCategory + 's'], letter: letter}))
    })

    /*
     * Redirect when a list item is selected.
     */

    $(document).on('click', '.listItem', function () {
      var labelType = ['/', listCategory, '/'].join('')
      window.location = labelType + this.innerHTML
    })

  }())

})