var equalmap = require('../lib/equalmap');
var Table = require('cli-table');

function tableDiff(oldStrArr, newStrArr) {
	var head = oldStrArr.map(function(v,k) {return k+':'+v});
	var cols = newStrArr;
	var mapData = equalmap(oldStrArr, newStrArr);
	head.unshift('');

	var table = new Table({head: head});
	table.push.apply(table, mapData.map(function(item, index) {
		var item2 = item.slice();
		item2.unshift(index+':'+cols[index]);
		return item2;
	}));
	console.log('diff: %s, %s', oldStrArr.join(''), newStrArr.join(''));
	console.log('longs: ', mapData.longs);
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
