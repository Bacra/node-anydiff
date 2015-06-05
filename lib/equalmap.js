module.exports = equalMap;

function equalMap(xStrArr, yStrArr) {
	// x: yStrArr  y: xStrArr
	var map = [];
	var longs = map.longs = {};
	function pushLongs(key, x, y) {
		(longs[key] || (longs[key] = [])).push({x: x, y: y});
	}

	var xLen = xStrArr.length;
	var yLen = yStrArr.length;
	for(var yIndex = 0; yIndex < yLen; yIndex++) {
		var lenArr = map[yIndex] = [];
		for (var xIndex = 0; xIndex < xLen; xIndex++) {
			var prev = xIndex === 0 || yIndex === 0 ? 0 : map[yIndex-1][xIndex -1];

			if (xStrArr[xIndex] == yStrArr[yIndex]) {
				lenArr[xIndex] = 1+prev;
				if (yIndex == yLen -1) {
					pushLongs(1+prev, xIndex, yIndex);
				}
			} else {
				lenArr[xIndex] = 0;
				if (prev) {
					pushLongs(prev, xIndex-1, yIndex-1);
				}
			}
		}
	}

	return map;
}
