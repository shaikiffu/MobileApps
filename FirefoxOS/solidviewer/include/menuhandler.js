MenuHandler = function ()
{
	this.content = null;
	this.parameters = null;
	this.origInputX = null;
	this.origValue = null;
};

MenuHandler.prototype =
{
	Init : function (content, parameters)
	{
		this.content = content;
		this.parameters = parameters;
		this.origInputX = null;
	},

	Fill : function ()
	{
		while (this.content.firstChild) {
			this.content.removeChild (this.content.firstChild);
		}
		
		var key;
		for (key in this.parameters) {
			this.GenerateParameter (key);
		}
	},
	
	GenerateParameter : function (key)
	{
		var div = document.createElement ('div');
		var paramDesc = this.parameters[key];
		
		var nameSpan = document.createElement ('span');
		nameSpan.className = 'name';
		nameSpan.innerHTML = key;
		div.appendChild (nameSpan);
		
		var valueSpan = document.createElement ('span');
		valueSpan.className = 'value';
		valueSpan.innerHTML = paramDesc[0].toFixed (1);
		div.appendChild (valueSpan);

		div.className = 'parameter';
		div.paramKey = key;
		
		this.AddEvents (div);
		this.content.appendChild (div);
	},
	
	AddEvents : function (div)
	{
		var myThis = this;
		div.addEventListener ('mouseup', function (event) {myThis.OnMouseUp (event);});
		div.addEventListener ('mousemove', function (event) {myThis.OnMouseMove (event);});
		div.addEventListener ('mousedown', function (event) {myThis.OnMouseDown (event);});
	},
	
	OnMouseDown : function (event)
	{
		var paramKeyDiv = this.FindParamKeyDiv (event);
		if (paramKeyDiv === null) {
			return;
		}

		var paramDesc = this.parameters[paramKeyDiv.paramKey]
		this.origInputX = event.clientX;
		this.origValue = paramDesc[0];
	},

	OnMouseMove : function (event)
	{
		if (this.origInputX === null) {
			return;
		}
		
		var diff = event.clientX - this.origInputX;
		var step = 10;
		if (diff > step || diff < -step) {
			var paramKeyDiv = this.FindParamKeyDiv (event);
			if (paramKeyDiv === null) {
				return;
			}
			
			var paramDesc = this.parameters[paramKeyDiv.paramKey];
			paramDesc[0] = this.origValue + parseInt (diff / step) * 0.1;
			paramKeyDiv.childNodes[1].innerHTML = paramDesc[0].toFixed (1);
		}
	},
	
	OnMouseUp : function (event)
	{
		this.origInputX = null;
		this.origValue = null;
	},
	
	FindParamKeyDiv : function (event)
	{
		var target = event.target;
		while (target !== null) {
			if (target.paramKey !== undefined) {
				return target;
			}
			target = target.parentElement;
		}
		return null;
	}
};
