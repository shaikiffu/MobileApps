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
		
		var nameDiv = document.createElement ('div');
		nameDiv.className = 'name';
		nameDiv.innerHTML = key;
		div.appendChild (nameDiv);
		
		var valueDiv = document.createElement ('div');
		valueDiv.className = 'value';
		this.SetValue (valueDiv, paramDesc);
		div.appendChild (valueDiv);

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
		this.origValue = paramDesc.value;
	},

	OnInputMove : function (target, x)
	{
		if (this.origInputX === null) {
			return;
		}
		
		var diff = x - this.origInputX;
		var step = 20;

		var paramKeyDiv = this.FindParamKeyDiv (target);
		if (paramKeyDiv === null) {
			return;
		}
		
		var paramDesc = this.parameters[paramKeyDiv.paramKey];
		if (paramDesc.type == 'float') {
			var eps = 0.00001;
			var newValue = this.origValue + parseInt (diff / step) * paramDesc.step;
			if (newValue >= paramDesc.min - eps && newValue <= paramDesc.max + eps) {
				paramDesc.value = parseFloat (newValue);
			}
		} else if (paramDesc.type == 'integer') {
			var newValue = this.origValue + parseInt (diff / step) * paramDesc.step;
			if (newValue >= paramDesc.min && newValue <= paramDesc.max) {
				paramDesc.value = parseInt (newValue);
			}
		} else if (paramDesc.type == 'list') {
			var origIndex = paramDesc.valueList.indexOf (this.origValue);
			var newIndex = origIndex + parseInt (diff / step);
			if (newIndex >= 0 && newIndex < paramDesc.valueList.length) {
				paramDesc.value = paramDesc.valueList[newIndex];
			}
		}
		this.SetValue (paramKeyDiv.childNodes[1], paramDesc);
	},
	
	OnInputEnd : function ()
	{
		this.origInputX = null;
		this.origValue = null;
	},
	
	SetValue : function (div, paramDesc)
	{
		if (paramDesc.type == 'float') {
			div.innerHTML = paramDesc.value.toFixed (1);
		} else {
			div.innerHTML = paramDesc.value;
		}
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
