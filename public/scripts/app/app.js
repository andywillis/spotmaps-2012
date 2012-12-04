$(document).ready(function () {

  (function() {

    // Set variables

    var $content = $('#content')
      , $genre = $('#genre .menuItem')
      , $genreList = $('nav ul ul')
      , pathname = window.location.pathname
      , root = '/' + pathname.split('/')[1]
      , route = root.match(/\/(home|genre|year|director|writer)*/g)[0] || '/'
      , type = route === '/' ? 'all' : pathname.replace(route + '/','')
      , getQuery = route === '/' ? 'genre=all' : [route.slice(1) + '=', type].join('')

    console.log(pathname, route);

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
        var frame = core.create({ el: 'div', class: 'spotmap clearfix' })
          , notes = core.create({ el: 'div', class: 'notes' })
          , br = core.create({type: 'el', el: 'br'})
          , spotmap = core.create({ el: 'img', class: 'spotmap box-shadow' })
          , directorLabel = map.director.length > 1 ? 'Directors' : 'Director'
          , writerLabel = map.writer.length > 1 ? 'Writers' : 'Writer'
          , director = map.director.join('</a><br/><a>')
          , writer = map.writer.join('</a><br/><a>')
          , html = ''
          , minutes = map.numberOfSpots/60
          , url = '/static/images/' + map.filename

        /*
         * At some point I'll move this to an underscore template
         * Doesn't seem much point at the moment.
         */

        html += '<p class="filmtitle value">#{title}</p>'.replace('#{title}', map.title)
        html += '<p class="label">Year</p>'
        html += '<p class="year value"><a>#{year}</a></p>'.replace('#{year}', map.year)
        html += '<p class="label">#{directorLabel}</p>'.replace('#{directorLabel}', directorLabel)
        html += '<p class="director value"><a>#{director}</a></p>'.replace('#{director}', director)
        html += '<p class="label">#{writerLabel}</p>'.replace('#{writerLabel}', writerLabel)
        html += '<p class="writer value"><a>#{writer}</a></p>'.replace('#{writer}', writer)
        html += '<p class="label">Spots</p>'
        html += '<p class="value">#{numberOfSpots} (#{minutes} mins)</p>'
          .replace('#{numberOfSpots}', map.numberOfSpots)
          .replace('#{minutes}', minutes)

        // html += '<p class="value"><img class="siteicon" src="/images/imdb.png"/><img class="siteicon" src="/images/letterboxd.png"/></p>'
        notes.innerHTML = html
        spotmap.src = url
        
        frame.appendChild(spotmap)
        frame.appendChild(notes)
        frag.appendChild(frame)
        frag.appendChild(br)
        group.appendChild(frag)
      })
  
      return group
    }

    /*
     * Immediately invoked function to pull the JSON film data
     * from the server and run it through the processData function
     * as soon as the page loads.
     */

    function getData(getQuery) {

      var url = '/get/?' + getQuery
      console.log(url);

      $.ajax({
        type: 'GET',
        url: url,
        success: function(data) {
          if (data) {
            var group = processData(JSON.parse(data))
            $content.empty()
            $content.append(group)            
          } else {
            console.log('No data.');
          }
        },
        error: function(err) {
          console.log(err);
        }
      })
      
    }

    /*
     * Load the data
     */

    getData(getQuery)

    /*
     * Hide the menu on item.onClick. This doesn't happen 
     * automatically as it's a CSS-only menu.
     */

    $genre.live('click', function (e) { $genreList.css({'display': 'none'}) })

    /*
     * Get list of spotmaps according to year
     */

    $('.value a').live('click', function (e) { 
      var labelType = ['/', this.parentNode.className.split(' ')[0], '/'].join('')
      window.location = labelType + this.innerHTML
    })

  }())

})