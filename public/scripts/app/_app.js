$(document).ready(function () {

  (function() {

    // Set variables

    var $content = $('#content')
      , $genre = $('#genre .menuItem')
      , $genreList = $('nav ul ul')
      , pathname = window.location.pathname
      , pathRegex = /(^\/$)|(^\/(home|genre|year|director|writer)+)/

    /*
     * Test and match the route and build the page query for the AJAX.
     */

    var root = '/' + pathname.split('/')[1]
      , route = root.match(pathRegex) ? root.match(pathRegex)[0] : '/'
      , routeMatch = pathRegex.test(pathname)
      , type = route === '/' ? 'all' : pathname.replace(route + '/','')
      , getQuery = route === '/' ? 'genre=all' : [route.slice(1) + '=', type].join('')

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

    function createSpotmap(data, callback) {
      
      var rgb = JSON.parse(data)
        , rgbLen = rgb.length
        , spot = {
            size: 8
          , border: 'rgba(120,120,120,1)'
          , borderWidth: 0.1
          }
        , o = []
        , xpos = 0
        , ypos = 0
        , additionalParameters = [spot,xpos,ypos]

        o[0] = core.create({el:'canvas', width: spot.size*60, height: (spot.size*rgbLen)/60 })
        o[1] = o[0].getContext('2d')

        var processSpotmapData = function() {
          var args = arguments[0]

          var spot = args.params[0]
            , xpos = args.params[1]
            , ypos = args.params[2]

          if (args.i % 60 === 0 && args.i !== 0) {
            ypos = ypos + spot.size
            xpos = 0
          }

          args.out[1].beginPath();
          args.out[1].rect(xpos,ypos,spot.size,spot.size)
          args.out[1].fillStyle = 'rgba(' + args.el + ', 1)'
          args.out[1].fill()
          args.out[1].lineWidth = spot.borderWidth
          args.out[1].strokeStyle = spot.border
          args.out[1].stroke()
          xpos = xpos + spot.size

          args.params[1] = xpos
          args.params[2] = ypos

          args.cb(args.out, args.i, args.params)

        }

        core.nbLoop3({arr: rgb, fn: processSpotmapData, out: o, params: additionalParameters, cb: function(o) {
          console.log(o);
          callback(o[0])
        }})

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

    function showCanvas(id) {
      var url = '/bin/?id=' + id
      getData(url, function(err, data) {
        if (err) console.log(err)
        else {
          $content.empty()
          var canvas = createSpotmap(data, function(canvas) {
            var img = canvas.toDataURL()
            $content.append(img)
          })
        }
      })
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

    $genre.live('click', function (e) { $genreList.css({'display': 'none'}) })

    /*
     * Get list of spotmaps according to type
     */

    $('.value a').live('click', function (e) { 
      var labelType = ['/', this.parentNode.className.split(' ')[0], '/'].join('')
      window.location = labelType + this.innerHTML
    })

    $('.spotmap').live('click', function () {
      showCanvas(this.id)
    })

  }())

})