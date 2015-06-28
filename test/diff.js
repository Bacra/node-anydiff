require('debug').enable('*');
var assert = require('assert');

var diff = require('../lib/diff');
var Table = require('cli-table');

function tableDiff(oldStr, newStr) {
	var diffData = diff(oldStr, newStr).data;
	var xArr = [];
	var yArr = [];
	var stArr = [];
	diffData.forEach(function(item) {
		xArr.push(item.xString());
		yArr.push(item.yString());
		stArr.push(item.status);
	});
	console.log(oldStr, newStr, xArr, yArr, stArr);

	assert.equal(oldStr, xArr.join(''))
	assert.equal(newStr, yArr.join(''))
}


tableDiff('abcd', '');
tableDiff('abcd', 'efghi');
tableDiff('abbbc', 'cabbc');
tableDiff('aabbbcbbc', 'cabbcaa');
