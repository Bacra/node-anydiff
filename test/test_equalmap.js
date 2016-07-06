var assert = require('assert');
var EqualMap = require('../lib/equalmap').EqualMap;
var Table = require('cli-table');
var chalk = require('chalk');
var diff = require('../lib/diff').diff;

function tableDiff(oldStr, newStr, equalData)
{
	var newStrArr = newStr.split('');
	var oldStrArr = oldStr.split('');
	var head = oldStrArr.slice();
	var cols = newStrArr;
	var emap = new EqualMap(oldStrArr, newStrArr);
	head.unshift('');

	var colAligns = new Array(head.length+1).join(' middle').split(' ');
	colAligns[0] = 'right';

	var table = new Table(
		{
			head: head,
			colAligns: colAligns
		});

	table.push.apply(table, emap.data()
		.map(function(item, index)
		{
			var item2 = item.map(function(val) {
				return val ? chalk.blue(val) : 0;
			});
			item2.unshift(cols[index]);
			return item2;
		}));
	console.log('diff, old:%s, new:%s', oldStr, newStr);
	console.log(table.toString());
	// console.log(diff(oldStrArr, newStrArr));
	assert.deepEqual(diff(oldStrArr, newStrArr), equalData);
}


tableDiff('abcd', '', [ { status: 'Delete', news: false, olds: [ 'a', 'b', 'c', 'd' ] } ]);

tableDiff('abcd', 'efghi',
[
	{
		status: 'Replace',
		news: [ 'e', 'f', 'g', 'h', 'i' ],
		olds: [ 'a', 'b', 'c', 'd' ]
	}
]);

tableDiff('abcd', 'efcgh',
[
	{ status: 'Replace', news: [ 'e', 'f' ], olds: [ 'a', 'b' ] },
	{ status: 'Equal', news: [ 'c' ], olds: [ 'c' ] },
	{ status: 'Replace', news: [ 'g', 'h' ], olds: [ 'd' ] }
]);

tableDiff('abbbc', 'cabbc',
[
	{ status: 'Add', news: [ 'c' ], olds: false },
	{ status: 'Equal', news: [ 'a', 'b', 'b' ], olds: [ 'a', 'b', 'b' ] },
	{ status: 'Delete', news: false, olds: [ 'b' ] },
	{ status: 'Equal', news: [ 'c' ], olds: [ 'c' ] }
]);

tableDiff('aabbbcbbc', 'cabbcaa',
[
	{ status: 'Replace', news: [ 'c' ], olds: [ 'a' ] },
	{ status: 'Equal', news: [ 'a', 'b', 'b' ], olds: [ 'a', 'b', 'b' ] },
	{ status: 'Delete', news: false, olds: [ 'b' ] },
	{ status: 'Equal', news: [ 'c' ], olds: [ 'c' ] },
	{ status: 'Replace', news: [ 'a', 'a' ], olds: [ 'b', 'b', 'c' ] }
]);
