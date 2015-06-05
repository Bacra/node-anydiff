module.exports = {
	equalMap: function(xStrArr, yStrArr) {
		var map = new EqualMap(xStrArr, yStrArr);
		map.reset();
		return map;
	},
	longest: Longest
};

function EqualMap(xStrArr, yStrArr) {
	if (!(this instanceof EqualMap)) {
		return new EqualMap(xStrArr, yStrArr);
	}

	this.xStrArr = xStrArr;
	this.yStrArr = yStrArr;
	this.start = this.end = this.data = null;
}

EqualMap.prototype = {
	reset: function() {
		// x: yStrArr  y: xStrArr
		var xStrArr = this.xStrArr;
		var yStrArr = this.yStrArr;

		var data = this.data = [];
		var xLen = xStrArr.length;
		var yLen = yStrArr.length;
		for(var yIndex = 0; yIndex < yLen; yIndex++) {
			var lenArr = data[yIndex] = [];
			for (var xIndex = 0; xIndex < xLen; xIndex++) {
				lenArr[xIndex] = xStrArr[xIndex] == yStrArr[yIndex];
			}
		}
	},
	xString: function() {
		return this._xyString('x');
	},
	yString: function() {
		return this._xyString('y');
	},
	getLongest: function(start, end) {
		return new Longest(this, start, end);
	},
	_xyString: function(key) {
		var arr = this[key+'StrArr'];
		if (!this.start && !this.end) {
			arr = arr.slice(this.start && this.start[key] || 0, this.end && this.end[key]);
		}

		return arr.join('');
	}
};

function Longest(emap, start, end) {
	if (!(this instanceof Longest)) {
		return new Longest(emap, start, end);
	}

	this.start = setDefaultAmount(start, {x:0, y:0}, Math.max);
	this.end = setDefaultAmount(end, {x: emap.xStrArr.length-1, y:emap.yStrArr.length-1}, Math.min);
	this.emap = emap;

	this.data = [];
	this.value = 0;

	this.reset();
}

Longest.prototype = {
	reset: function() {
		var start = this.start;
		var end = this.end;

		var longVal = 0;
		var longArr = [];
		var tmpMap = {};

		var xLen = end.x+1;
		var yLen = end.y+1;
		var mapData = this.emap.data;

		for(var yIndex = start.y; yIndex < yLen; yIndex++) {
			for (var xIndex = start.x; xIndex < xLen; xIndex++) {
				if (mapData[yIndex][xIndex]) {
					var val = tmpMap[yIndex+':'+xIndex] = (tmpMap[(yIndex-1)+':'+(xIndex-1)] || 0)+1;

					if (longVal <= val) {
						if (longVal < val) {
							longVal = val;
							longArr = [];
						}
						longArr.push({x: xIndex, y: yIndex});
					}
				}
			}
		}

		this.data = longArr;
		this.value = longVal;
	},
	toEqualMap: function() {
		return this._genEqualMap(this.start, this.end);
	},
	eqEqualMap: function(index) {
		var data = this.data[index || 0];
		return this._genEqualMap({x: data.x - this.value, y: data.y - this.value}, data);
	},
	_genEqualMap: function(start, end) {
		var map = new EqualMap(this.emap.xStrArr, this.emap.yStrArr);

		map.data = this.emap.data;
		map.start = start;
		map.end = end;

		return map;
	}
};


function setDefaultAmount(vals, defaults, handler) {
	if (!vals) return defaults;

	for(var i in defaults) {
		if (defaults.hasOwnProperty(i)) {
			vals[i] = handler(defaults[i], vals[i] || 0);
		}
	}

	return vals;
}
