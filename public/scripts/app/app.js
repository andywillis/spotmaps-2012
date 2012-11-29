$(document).ready(function () {

  (function() {

    function processData(spotmapList) {

      // Create the containing element and docfrag

      var group = core.create({ type: 'el', el: 'div', class: 'group' })
        , frag = core.create({ type: 'frag' })

      // For each film in the returned film list
      // create a spotmap div, image and notes and
      // append them to the group div.

      spotmapList.forEach(function(map) {
        var frame = core.create({ type: 'el', el: 'div', id: map.id, class: 'spotmap clearfix' })
          , notes = core.create({ type: 'el', el: 'div', class: 'notes' })
          , br = core.create({type: 'el', el: 'br'})
          , img = core.create({ type: 'el', el: 'img', class: 'spotmap box-shadow' })
          , directorLabel = core.toType(map.director) == 'array' ? 'Directors' : 'Director'
          , writerLabel = core.toType(map.writer) === 'array' ? 'Writers' : 'Writer'
          , writer = core.toType(map.writer) === 'array' ? map.writer.join('<br/>') : map.writer
          , html = ''
          , minutes = map.numberOfSpots/60

        // At some point I'll move this to an underscore template
        // Doesn't seem much point at the moment.

        html += '<p class="value filmtitle">' + map.title + '</p>'
        html += '<p class="label">' + directorLabel + '</p>'
        html += '<p class="value">' + map.director + '</p>'
        html += '<p class="label">' + writerLabel + '</p>'
        html += '<p class="value">' + writer + '</p>'
        html += '<p class="label">Spots</p>'
        html += '<p class="value">' + map.numberOfSpots + ' ('+ minutes +' mins)</p>'
        notes.innerHTML = html
        img.src = '/images/spotmaps/' + map.filename
        
        // Append the image, notes to the spotmap div,
        // append the spotmap div to the docfrag,
        // and append the whole lot to the group div

        frame.appendChild(img)
        frame.appendChild(notes)
        frag.appendChild(frame)
        frag.appendChild(br)
        group.appendChild(frag)
      })
  
      // Return the group of spotmaps

      return group
    }

    // Set variables
    var pathname = window.location.pathname

    if (!!~['/', '/home'].indexOf(pathname)) {
      $.ajax({
        type: 'GET',
        url: '/latest',
        success: function(data) {
          var content = core.get('content'), group = processData(JSON.parse(data))
          content.appendChild(group)
        },
        error: function(err) {
          console.log(err);
        }
      })

    }

  }())

})