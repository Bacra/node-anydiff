var equalMap = require('../lib/equalmap');
var Table = require('cli-table');

function tableDiff(oldStrArr, newStrArr) {
	var head = oldStrArr.map(function(v,k) {return (k+':'+v).split('').join('\n')});
	var cols = newStrArr;
	var mapData = equalMap.equalMap(oldStrArr, newStrArr);
	head.unshift('');

	var table = new Table({head: head});
	table.push.apply(table, mapData.data.map(function(item, index) {
		var item2 = item.map(function(val) {
			return val ? 1 : 0;
		});
		item2.unshift(index+':'+cols[index]);
		return item2;
	}));
	console.log('diff: %s, %s', oldStrArr.join(''), newStrArr.join(''));
	console.log('all longs: ', equalMap.longest(mapData));
	console.log('longs(0<=x<=4, 0<=y<=6): ', equalMap.longest(mapData, {x:0,y:0}, {x:4, y:6}));
	console.log('longs(1<=x<=4, 2<=y<=6): ', equalMap.longest(mapData, {x:1,y:2}, {x:4, y:6}));
	console.log(table.toString());
}

function str2arr(str) {
	return str.split('');
}

function word2arr(str) {
	return str.split(/\b/);
}

tableDiff(str2arr('abcd'), str2arr('efghi'));
tableDiff(str2arr('abbbc'), str2arr('cabbc'));
tableDiff(str2arr('aabbbcbbc'), str2arr('cabbcaa'));

tableDiff(word2arr('abc d efg cd  abc'), word2arr('ab cd efg cdef abc'));
