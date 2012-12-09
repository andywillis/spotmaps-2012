      var rgba = data
        , rgbaLen = rgba.length
        , spot = {
            size: 8
          , border: 'rgba(120,120,120,1)'
          , borderWidth: 0.1
          }
        , o = []
        , xpos = 0
        , ypos = 0
        , additionalParameters = [spot,xpos,ypos]

      o[0] = new Canvas(spot.size*60,(spot.size*rgbaLen)/60)
      o[1] = o[0].getContext('2d')

      for (var i = 0, len = rgb.length; i < len; i++) {
        var spot = additionalParameters[0]
          , xpos = additionalParameters[1]
          , ypos = additionalParameters[2]

        if (iteration % 60 === 0 && iteration !== 0) {
          ypos = ypos + spot.size
          xpos = 0
        }

        o[1].beginPath();
        o[1].rect(xpos,ypos,spot.size,spot.size)
        o[1].fillStyle = 'rgba(' + entry + ', 1)'
        o[1].fill()
        o[1].lineWidth = spot.borderWidth
        o[1].strokeStyle = spot.border
        o[1].stroke()
        xpos = xpos + spot.size

        additionalParameters[1] = xpos
        additionalParameters[2] = ypos

        callback(o, iteration, additionalParameters)

      }
