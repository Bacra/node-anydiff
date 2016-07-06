var EqualMap = require('./equalmap').EqualMap;
var Block = require('./block').Block;
var walker = require('./walker').walker;

exports.diff = diff;
function diff(oldArr, newArr, options)
{
	options || (options = {});
	var emap = new EqualMap(oldArr, newArr, options.eqaul);
	if (typeof options.equal == 'function') this.equal = options.equal;
	var block = new Block(emap);

	return walker(block, options.choose)
		.map(function(block)
		{
			return block.toJSON();
		});
}

exports.diffChar = diffChar;
function diffChar(oldStr, newStr, options)
{
	return diff(oldStr.split(''), newStr.split(''), options);
}
