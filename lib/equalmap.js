exports.EqualMap = EqualMap;

function EqualMap(oldArr, newArr, equalHandler)
{
	this.oldArr = oldArr;
	this.newArr = newArr;
	this._data = null;

	if (typeof equalHandler == 'function') this.equal = equalHandler;
}

EqualMap.prototype =
{
	data: function()
	{
		if (!this._data) this.reset();
		return this._data;
	},
	reset: function()
	{
		var newArr = this.newArr;
		var oldArr = this.oldArr;

		var data = this._data = [];
		var newLen = newArr.length;
		var oldLen = oldArr.length;
		var lenArr, newIndex, oldIndex, newItem, oldItem;

		for (newIndex = 0; newIndex < newLen; newIndex++)
		{
			lenArr = data[newIndex] = [];
			newItem = newArr[newIndex];
			for (oldIndex = 0; oldIndex < oldLen; oldIndex++)
			{
				oldItem = oldArr[oldIndex];
				lenArr[oldIndex] = this.equal(oldItem, newItem);
			}
		}
	},
	equal: function(a, b)
	{
		return a == b ? 1 : 0;
	}
};


