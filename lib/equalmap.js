var debug = require('debug')('diff2:equalMap');
/**
 * 0: ��Ч����ȵ����� 1: ������  2: ��ɾ�� 3: ��� 4:  �滻  -1: ���ɻ���
 * @type {Object}
 */
var statMap = {
	'Invalid': 0,
	'Add': 1,
	'Delete': 2,
	'Equal': 3,
	'Replace': 4,
	'Unknow': -1
};

module.exports = {
	statMap: statMap,
	equalMap: function(xStrArr, yStrArr) {
		var map = new EqualMap(xStrArr, yStrArr);
		map.reset();
		return map;
	},
	closest: Closest,
	str2arr: function(str) {
		if (typeof str == 'object') return str;

		return str.split('');
	},
	word2arr: (function() {
		if (typeof str == 'object') return str;

		var concat = Array.prototype.concat;
		var zhSplit = /[\u2E80-\u9FFF]|[^\u2E80-\u9FFF]+/g;
		var enSplit = /\b/;
		return function(str) {
			return concat.apply([], str.split(enSplit).map(function(v){return v.match(zhSplit)}));
		};
	})()
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
	/**
	 * ��ȡxyStringȫ���ĶԱȽ��
	 */
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
	/**
	 * toString x
	 * @return {String}
	 */
	xString: function() {
		return this._xyString('x');
	},
	/**
	 * toString y
	 * @return {String}
	 */
	yString: function() {
		return this._xyString('y');
	},
	/**
	 * ��ȡClosest����
	 * @param  {Object} start ��ʼλ�ã���ѡ
	 * @param  {Object} end   ����λ�ã���ѡ
	 * @return {Closest}
	 */
	getClosest: function(start, end) {
		return new Closest(this, start || this.start, end || this.end);
	},
	_xyString: function(key) {
		var arr = this[key+'StrArr'];
		if (this.start && this.end) {
			arr = arr.slice(this.start && this.start[key] || 0, this.end && (this.end[key]+1));
		}

		return arr.join('');
	}
};

function Closest(emap, start, end) {
	if (!(this instanceof Closest)) {
		return new Closest(emap, start, end);
	}

	this.start = setDefaultAmount(start, {x:0, y:0}, Math.max);
	this.end = setDefaultAmount(end, {x: emap.xStrArr.length-1, y:emap.yStrArr.length-1}, Math.min);
	this.emap = emap;

	this.data = [];
	this.value = 0;

	this.reset();
}

Closest.prototype = {
	statMap: statMap,
	/**
	 * ��ȡ����б�
	 * �����ʼ��ʱ����
	 */
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
	/**
	 * ת��ΪEqualMap����
	 * @return {EqualMap}
	 */
	toEqualMap: function() {
		return this._genEqualMap(this.start, this.end);
	},
	/**
	 * ��������У�ѡ��һ��������ǰ������
	 * @param  {Number} index ѡȡ��index
	 * @return {Array}        ʹ��EqualMap����
	 */
	eqEqualMaps: function(index) {
		var xy = this.data[index || 0];
		// û����ȵ�����
		if (!xy) {
			var st = this._intervalStat(this.start, this.end);
			if (!st) return [];
			// ������ʱ�򣬻���-1�����䣬�Ǿ����滻
			return [this._genEqualMap(this.start, this.end, st < 0 ? this.statMap.Replace : st)];
		}

		var stEnd = this._countXY(xy, -this.value);
		var edStart = this._countXY(xy, 1);

		var stStat = this._intervalStat(this.start, stEnd);
		var endStat = this._intervalStat(edStart, this.end);
		var rs = [];

		if (stStat) rs.push(this._genEqualMap(this.start, stEnd, stStat));
		rs.push(this._genEqualMap(this._countXY(stEnd, 1), xy, this.statMap.Equal));
		if (endStat) rs.push(this._genEqualMap(edStart, this.end, endStat));

		return rs;
	},
	_genEqualMap: function(start, end, st) {
		var map = new EqualMap(this.emap.xStrArr, this.emap.yStrArr);

		map.data = this.emap.data;
		map.start = start;
		map.end = end;
		map.status = typeof st == 'number' ? st : this._intervalStat(start, end);

		return map;
	},
	_intervalStat: function(start, end) {
		// x y����Ч
		if (start.x > end.x && start.y > end.y) {
			debug('Invalid status start:%o end:%o', start, end);
			return this.statMap.Invalid;
		}
		// �հ�����
		if (start.x == end.x -1 && start.y == end.y -1) {
			debug('Empty status start:%o end:%o', start, end);
			return this.statMap.Invalid;
		}
		// x��Ч
		if (start.x > end.x) return this.statMap.Add;
		// y��Ч
		if (start.y > end.y) return this.statMap.Delete;

		return this.statMap.Unknow;
	},
	_countXY: function(xy, count) {
		return xy && {
			x: xy.x + count,
			y: xy.y + count
		};
	},
	toJSON: function() {
		return {
			data: this.data,
			value: this.value
		};
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
