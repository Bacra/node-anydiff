var debug = require('debug')('anydiff:walker');

exports.walker = walker;

function walker(block, chooseHandler)
{
	var status = block.status();
	debug('block status:%s', status);

	if (status == 'Unknow')
	{
		var index = (chooseHandler || DefaultChooseHandler)(block.list(), block);
		var interval = block.eq(index);
		if (!interval)
		{
			debug('get no interval in Unknow block, index:%d, block:%o', index, block);
			block._status = 'Replace';
			return [block];
		}
		else
		{
			var result = [];
			if (interval.leftItem)
				result = result.concat(walker(interval.leftItem, chooseHandler));

			result.push(interval.equalItem);

			if (interval.rightItem)
				result = result.concat(walker(interval.rightItem, chooseHandler));

			return result;
		}
	}
	else
	{
		return status != 'Ignore' ? [block] : [];
	}
}

function DefaultChooseHandler() {return 0}
