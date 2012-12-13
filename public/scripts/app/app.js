$(document).ready(function () {

  (function () {

    // Set variables

    var $content = $('#content')
      , $genre = $('#genre .menuItem')
      , $genreList = $('nav ul ul')
      , $loader = $('div#loader')
      , spotmapTemplate = _.template($('#spotmapTemplate').html())
      , pathname = window.location.pathname
      , pathRegex = /(^\/$)|(^\/(home|genre|year|director|writer)+)/
      , showRegex = /(^\/show)/
      , root = '/' + pathname.split('/')[1]
      , route = root.match(pathRegex) ? root.match(pathRegex)[0] : '/'
      , routeMatch = pathRegex.test(pathname)
      , showMatch = showRegex.test(pathname)
      , type = route === '/' ? 'all' : pathname.replace(route + '/','')
      , getQuery = route === '/' ? 'genre=all' : [route.slice(1) + '=', type].join('')
      , imageData = undefined
      , slice = Array.prototype.slice
      , chock

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

        // Create new elements
        var frame = core.create({ el: 'div', class: 'frame clearfix' })
          , br = core.create({type: 'el', el: 'br'})

        // Format the map information labels and data.
        map.directorLabel = map.director.length > 1 ? 'Directors' : 'Director'
        map.writerLabel = map.writer.length > 1 ? 'Writers' : 'Writer'
        map.director = map.director.join('</a><br/><a>')
        map.writer = map.writer.join('</a><br/><a>')
        map.minutes = map.numberOfSpots/60
        map.src = '/static/images/' + map.filename

        // Push the data into the template and render it.
        frame.innerHTML = spotmapTemplate({map: map})
        frag.appendChild(frame)
        frag.appendChild(br)
        group.appendChild(frag)

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
        , size = size || 4

      if (imageData) {
        convertAndDisplay(size)
      } else {
        getData(url, function(err, data) {
          imageData = data
          if (err) console.log(err)
          else {
            convertAndDisplay(size)
          }
        })
      }
     }

     /*
      * Use the imageData to build a new canvas, use that data for a new
      * image and append it to the content div.
      */

    function convertAndDisplay(size) {
      console.log('d');
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
     * If the showRoute is true load the spotmap hex data and
     * preselect the 4 button as the default setting.
     */

    if (showMatch) {
      getCanvasData();
      $('.size').filter(function(){ return $(this).text() === '4' }).addClass('selected')
    }

    /*
     * If the route is anything other than Show load the data.
     */

    if (routeMatch) {
      var url = '/json/?' + getQuery
      getData(url, function(err, data) {
        if (err) console.log(err)
        else {
          var group = processData(JSON.parse(data))
          $content.empty()
          $content.append(group)
          var $images = slice.call($('img.spotmap'))
          $loader.css({'visibility': 'visible'})
          chock = setInterval(function(){ checkImages($images) }, 500)
        }
      })
    }

    function checkImages(imageList) {
      var count = imageList.length;
      imageList.forEach(function(image){
        if (image.naturalHeight !== 0) {
          count--
          if (count === 0) {
            $loader.css({'visibility': 'hidden'})
            clearInterval(chock)
          }
        }
      })
    }

    /*
     * Hide the menu on item.onClick. This doesn't happen 
     * automatically as it's a CSS-only menu.
     */

    $genre.live('click', function () { $genreList.css({'display': 'none'}) })

    /*
     * Get list of spotmaps according to type
     */

    $('.value a').live('click', function () { 
      var labelType = ['/', this.parentNode.className.split(' ')[0], '/'].join('')
      window.location = labelType + this.innerHTML
    })

    $('.spotmap').live('click', function () {
      console.log(this);
      window.location = '/show/?id=' + this.id
    })

    $('.size').live('click', function () {
      $('.size').removeClass('selected')
      var size = this.innerHTML;
      $(this).addClass('selected')
      convertAndDisplay(parseInt(size))
    })

  }())

})