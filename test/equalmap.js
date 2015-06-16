var equalMap = require('../lib/equalmap');
var Table = require('cli-table');

function tableDiff(oldStrArr, newStrArr) {
	var head = oldStrArr.map(function(v,k) {return (k+':'+v).split('').join('\n')});
	var cols = newStrArr;
	var emap = equalMap.equalMap(oldStrArr, newStrArr);
	head.unshift('');

	var table = new Table({head: head});
	table.push.apply(table, emap.data.map(function(item, index) {
		var item2 = item.map(function(val) {
			return val ? 1 : 0;
		});
		item2.unshift(index+':'+cols[index]);
		return item2;
	}));
	console.log('diff: %s, %s', oldStrArr.join(''), newStrArr.join(''));
	console.log('all longs: ', emap.getClosest().toJSON());
	console.log('longs(0<=x<=4, 0<=y<=6): ', emap.getClosest({x:0,y:0}, {x:4, y:6}).toJSON());
	console.log('longs(1<=x<=4, 2<=y<=6): ', emap.getClosest({x:1,y:2}, {x:4, y:6}).toJSON());
	console.log(table.toString());
}


tableDiff(equalMap.str2arr('abcd'), equalMap.str2arr('efghi'));
tableDiff(equalMap.str2arr('abcd'), equalMap.str2arr('efcgh'));
tableDiff(equalMap.str2arr('abbbc'), equalMap.str2arr('cabbc'));
tableDiff(equalMap.str2arr('aabbbcbbc'), equalMap.str2arr('cabbcaa'));

tableDiff(equalMap.word2arr('abc d efg cd  abc'), equalMap.word2arr('ab cd efg cdef abc'));
tableDiff(equalMap.word2arr('d 我们 abc'), equalMap.word2arr('我们a 可以 abc'));
