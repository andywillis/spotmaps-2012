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
