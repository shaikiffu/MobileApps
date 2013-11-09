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
		div.addEventListener ('touchstart', function (event) {myThis.OnTouchStart (event);});
		div.addEventListener ('touchmove', function (event) {myThis.OnTouchMove (event);});
		div.addEventListener ('touchend', function (event) {myThis.OnTouchEnd (event);});
	},

	OnMouseDown : function (event)
	{
		this.OnInputStart (event.target, event.clientX);
	},

	OnMouseMove : function (event)
	{
		this.OnInputMove (event.target, event.clientX);
	},
	
	OnMouseUp : function (event)
	{
		this.OnInputEnd ();
	},
	
	OnTouchStart : function (event)
	{
		if (event.touches.length === 0) {
			return;
		}
		var touch = event.touches[0];	
		this.OnInputStart (touch.target, touch.pageX);
	},

	OnTouchMove : function (event)
	{
		if (event.touches.length === 0) {
			return;
		}
		var touch = event.touches[0];	
		this.OnInputMove (touch.target, touch.pageX);
	},
	
	OnTouchEnd : function (event)
	{
		this.OnInputEnd ();
	},
	
	OnInputStart : function (target, x)
	{
		var paramKeyDiv = this.FindParamKeyDiv (target);
		if (paramKeyDiv === null) {
			return;
		}

		var paramDesc = this.parameters[paramKeyDiv.paramKey]
		this.origInputX = x;
		this.origValue = paramDesc[0];
	},

	OnInputMove : function (target, x)
	{
		if (this.origInputX === null) {
			return;
		}
		
		var diff = x - this.origInputX;
		var step = 10;
		if (diff > step || diff < -step) {
			var paramKeyDiv = this.FindParamKeyDiv (target);
			if (paramKeyDiv === null) {
				return;
			}
			
			var paramDesc = this.parameters[paramKeyDiv.paramKey];
			paramDesc[0] = this.origValue + parseInt (diff / step) * 0.1;
			paramKeyDiv.childNodes[1].innerHTML = paramDesc[0].toFixed (1);
		}
	},
	
	OnInputEnd : function ()
	{
		this.origInputX = null;
		this.origValue = null;
	},
	
	FindParamKeyDiv : function (eventTarget)
	{
		var target = eventTarget;
		while (target !== null) {
			if (target.paramKey !== undefined) {
				return target;
			}
			target = target.parentElement;
		}
		return null;
	}
};
