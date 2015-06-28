var debug = require('debug')('ldiff:diff');
var equalMap = require('./equalmap');
module.exports = Diff;


function Diff(xStr, yStr) {
	if (!(this instanceof Diff)) {
		return new Diff(xStr, yStr);
	}

	this.xStrArr = this.str2arr(xStr);
	this.yStrArr = this.str2arr(yStr);
	this.data = this.handler(equalMap.equalMap(this.xStrArr, this.yStrArr));
}

Diff.prototype = {
	str2arr: equalMap.str2arr,
	handler: function(emap) {
		var self = this;
		var data = [];

		// 直接选择队列中的第一个
		emap.getClosest().eqEqualMaps(0)
			.forEach(function(emap) {
				if (emap.status < 0) {
					data = data.concat(self.handler(emap));
				} else if (emap.status) {
					data.push(emap);
				} else {
					debug('Invalid status %d, %o', emap.status, emap);
				}
			});

		return data;
	}
};
