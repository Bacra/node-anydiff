var debug = require('debug')('diff2:diff');
var equalMap = require('./equalmap');
module.exports = diff;

function diff(xStr, yStr) {
	var emap = equalMap.equalMap(equalMap.str2arr(xStr), equalMap.str2arr(yStr));
	return emapHandler(emap);
}

function emapHandler(emap) {
	var rs = [];

	emap.getClosest().eqEqualMap(0)
		.forEach(function(emap) {
			if (emap.status < 0) {
				rs = rs.concat(emapHandler(emap));
			} else if (emap.status) {
				rs.push(emap);
			} else {
				debug('Invalid status %d, %o', emap.status, emap);
			}
		});

	return rs;
}

