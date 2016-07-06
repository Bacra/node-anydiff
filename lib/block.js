var debug = require('debug')('anydiff:block');


exports.Block = Block;
// x 为旧数据
// y 为新数据
function Block(emap, start, end)
{
	this.start = start || {x:0, y:0};
	this.end = end || {x: emap.oldArr.length-1, y: emap.newArr.length-1};
	this.emap = emap;

	this._list = null;
	this._weight = 0;
	this._status = null;
	this._maxOffest = 0;
}

Block.prototype =
{
	weight: function()
	{
		if (!this._list) this.reset();
		return this._weight;
	},
	list: function()
	{
		if (!this._list) this.reset();
		return this._list;
	},
	status: function()
	{
		if (!this._list) this.reset();
		return this._status;
	},
	maxOffest: function()
	{
		if (!this._list) this.reset();
		return this._maxOffest;
	},
	block: function(start, end)
	{
		return new Block(this.emap, start, end);
	},
	/**
	 * 获取最长快列表
	 * 对象初始化时调用
	 */
	reset: function()
	{
		var start = this.start;
		var end = this.end;

		// 不存在的区间
		if (start.x > end.x && start.y > end.y)
		{
			this._list = [];
			this._weight = 0;
			this._status = 'Ignore';
		}
		// x 无值
		else if (start.x > end.x)
		{
			this._list = [];
			this._weight = 0;
			this._status = 'Add';
		}
		// y 无值
		else if (start.y > end.y)
		{
			this._list = [];
			this._weight = 0;
			this._status = 'Delete'
		}
		else
		{
			var longWeight = 0;		// 带权重的最大值
			var longList = [];		// 最长的index
			var longOffset = 0;		// 最大偏移值
			var tmpMap = {};

			var maxIndexX = end.x+1;
			var maxIndexY = end.y+1;
			var mapData = this.emap.data();

			for (var yIndex = start.y; yIndex < maxIndexY; yIndex++)
			{
				for (var xIndex = start.x; xIndex < maxIndexX; xIndex++)
				{
					// 带有权重
					var itemVal = mapData[yIndex][xIndex];
					if (itemVal > 0)
					{
						var preItem = tmpMap[(yIndex-1)+':'+(xIndex-1)] || {start: {x: xIndex, y: yIndex}, value: 0};
						var curItem = tmpMap[yIndex+':'+xIndex] = {start: preItem.start, value: preItem.value+itemVal};

						if (longWeight <= curItem.value)
						{
							if (longWeight < curItem.value)
							{
								longWeight = curItem.value;
								longList = [];
								longOffset++;
							}

							longList.push({start: curItem.start, end: {x: xIndex, y: yIndex}});
						}
					}
				}
			}

			this._list = longList;
			this._weight = longWeight;
			this._maxOffest = longOffset;

			debug('weight:%d, maxOffest:%d, list: %o', longWeight, longOffset, longList);
			if (longWeight)
			{
				this._status = longOffset == maxIndexX - start.x
							&& longOffset == maxIndexY - start.y
							? 'Equal' : 'Unknow';
			}
			else
			{
				this._status = 'Replace';
			}
		}
	},
	/**
	 * 从最长数组中，选择一条，返回前后区间
	 * @param  {Number} index 选取的index
	 */
	eq: function(index)
	{
		if (this.status() != 'Unknow') return;
		var xy = this.list()[index];
		if (!xy) return;

		return {
			leftItem: this.block(this.start, {x: xy.start.x-1, y: xy.start.y-1}),
			equalItem: this.block(xy.start, xy.end),
			rightItem: this.block({x: xy.end.x+1, y: xy.end.y+1}, this.end)
		};
	},
	toJSON: function()
	{
		var status = this.status();
		if (status != 'Ignore')
		{
			debug('this.start:%o, this.end:%o, status:%s', this.start, this.end, status);
			return {
				status: status,
				news: status != 'Delete' && this.emap.newArr.slice(this.start.y, this.end.y+1),
				olds: status != 'Add' && this.emap.oldArr.slice(this.start.x, this.end.x+1)
			};
		}
	}
};
