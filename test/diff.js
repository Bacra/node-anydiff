require('debug').enable('*');

var diff = require('../lib/diff');
var Table = require('cli-table');

function tableDiff(oldStrArr, newStrArr) {
	var diffData = diff(oldStrArr, newStrArr);
	var xArr = [];
	var yArr = [];
	diffData.forEach(function(item) {
		xArr.push(item.xString());
		yArr.push(item.yString());
	});
	console.log(oldStrArr, newStrArr, xArr, yArr);
}


tableDiff('abcd', 'efghi');
tableDiff('abbbc', 'cabbc');
tableDiff('aabbbcbbc', 'cabbcaa');
