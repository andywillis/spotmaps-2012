$(document).ready(function () {

  (function() {

    // Set variables

    var $content = $('#content')
      , $genre = $('#genre .menuItem')
      , $genreList = $('nav ul ul')
      , pathname = window.location.pathname
      , root = '/' + pathname.split('/')[1]
      , route = root.match(/^\/(home|genre)*$/g)[0] || '/'
      , genre = route === '/' ? 'all' : pathname.replace('/genre/','')

    /*
     * Hide the menu on item.onClick.
     * This doesn't happen automatically as it's a CSS-only menu.
     */

    $genre.live('click', function (e) { $genreList.css({'display': 'none'}) })

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
        var frame = core.create({ el: 'div', id: map.id, class: 'spotmap clearfix' })
          , notes = core.create({ el: 'div', class: 'notes' })
          , br = core.create({type: 'el', el: 'br'})
          , img = core.create({ el: 'img', class: 'spotmap box-shadow' })
          , directorLabel = core.toType(map.director) == 'array' ? 'Directors' : 'Director'
          , writerLabel = core.toType(map.writer) === 'array' ? 'Writers' : 'Writer'
          , director = core.toType(map.director) === 'array' ? map.director.join('<br/>') : map.director
          , writer = core.toType(map.writer) === 'array' ? map.writer.join('<br/>') : map.writer
          , html = ''
          , minutes = map.numberOfSpots/60
          , url = '/static/images/' + map.filename + '.png'

        /*
         * At some point I'll move this to an underscore template
         * Doesn't seem much point at the moment.
         */

        html += '<p class="value filmtitle">' + map.title + '</p>'
        html += '<p class="label">' + directorLabel + '</p>'
        html += '<p class="value">' + director + '</p>'
        html += '<p class="label">' + writerLabel + '</p>'
        html += '<p class="value">' + writer + '</p>'
        html += '<p class="label">Spots</p>'
        html += '<p class="value">' + map.numberOfSpots + ' ('+ minutes +' mins)</p>'
        notes.innerHTML = html
        img.src = url
        
        frame.appendChild(img)
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

    (function getData(genre) {

      var url = '/get/?' + 'genre=' + genre

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
      
    }(genre))

  }())

})