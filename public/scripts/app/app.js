$(document).ready(function () {

  (function() {

    // Set variables

    var $content = $('#content')
      , $genre = $('#genre .menuItem')
      , $genreList = $('nav ul ul')
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

    /*
     * For each film in the film list create a spotmap div, image and notes
     * and append them to the group div. The function makes use of the 'create'
     * and 'get' functions from the core module which allows elements and their
     * ids and attributes to be created in one statement.
     * 
     * Native Javascript DOM coding is used instead of jQuery because it's 
     * slightly more efficient.
     */

    function processData(spotmapList) {

      var group = core.create({ el: 'div', class: 'group' })
        , frag = core.create({ type: 'frag' })

      spotmapList.forEach(function(map) {

        // Create new elements
        var frame = core.create({ el: 'div', class: 'frame clearfix' })
          , notes = core.create({ el: 'div', class: 'notes' })
          , br = core.create({type: 'el', el: 'br'})
          , spotmap = core.create({ el: 'img', id: map.id, class: 'spotmap box-shadow' })
        
        // Format the map information labels and data.
        map.directorLabel = map.director.length > 1 ? 'Directors' : 'Director'
        map.writerLabel = map.writer.length > 1 ? 'Writers' : 'Writer'
        map.director = map.director.join('</a><br/><a>')
        map.writer = map.writer.join('</a><br/><a>')
        map.minutes = map.numberOfSpots/60
        map.url = '/static/images/' + map.filename
        html = ''

        /*
         * At some point I'll move this to an underscore template
         * Doesn't seem much point at the moment.
         */

        html += '<p class="filmtitle value">#{title}</p>'.replace('#{title}', map.title)
        html += '<p class="label">Year</p>'
        html += '<p class="year value"><a>#{year}</a></p>'.replace('#{year}', map.year)
        html += '<p class="label">#{directorLabel}</p>'.replace('#{directorLabel}', map.directorLabel)
        html += '<p class="director value"><a>#{director}</a></p>'.replace('#{director}', map.director)
        html += '<p class="label">#{writerLabel}</p>'.replace('#{writerLabel}', map.writerLabel)
        html += '<p class="writer value"><a>#{writer}</a></p>'.replace('#{writer}', map.writer)
        html += '<p class="label">Spots</p>'
        html += '<p class="value">#{numberOfSpots} (#{minutes} mins)</p>'
          .replace('#{numberOfSpots}', map.numberOfSpots)
          .replace('#{minutes}', map.minutes)

        // Attach the notes and the source the image
        spotmap.src = map.url
        notes.innerHTML = html
        
        frame.appendChild(spotmap)
        frame.appendChild(notes)
        frag.appendChild(frame)
        frag.appendChild(br)
        group.appendChild(frag)
      })
  
      return group
    }

    function createSpotmap(size) {

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

      return obj = {data: canvas, size: [cwidth, cheight]}
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
     * Displays the spotmap canvas when an image is clicked.
     */    

    if (showMatch) {
      getCanvasData();
      $('.size').filter(function(){ return $(this).text() === '4' }).addClass('selected')
    }

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

    function convertAndDisplay(size) {
      canvas = createSpotmap(size)
      img = core.create({
        el:'img',
        class: 'canvas',
        src: canvas.data.toDataURL(),
        width: canvas.size[0],
        height: canvas.size[1]
      })
      $content.empty().append(img)
     }

    /*
     * If the route is a match (previously checked) load the data.
     */

    if (routeMatch) {
      var url = '/json/?' + getQuery
      getData(url, function(err, data) {
        if (err) console.log(err)
        else {
          var group = processData(JSON.parse(data))
          $content.empty()
          $content.append(group)          
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