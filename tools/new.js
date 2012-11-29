var nbLoop2 = require('nbLoop2')

nbLoop2({
	arr: [1,2,3,4],
	out: 0,
	fn: function() {
		var $ = arguments[0]
		$.out.push('1')
		$.cb($.out, $.i, $.params)
	},
	cb: function(count, results){
		console.log(count, results)
	}
})