WebAppLib = function ()
{
	window.addEventListener ('load', this.Load.bind (this), false);
	window.addEventListener ('resize', this.Resize.bind (this), false);
};

WebAppLib.prototype.Resize = function ()
{
	var menus = document.getElementsByClassName ('menu');
	var mains = document.getElementsByClassName ('main');

	if (menus.length === 0 || mains.length === 0) {
		return;
	}
	
	var menu = menus[0];
	var main = mains[0];
	main.style.width = window.innerWidth + 'px';
	main.style.height = (window.innerHeight - menu.clientHeight) + 'px';
}

WebAppLib.prototype.Load = function ()
{
	this.Resize ();
}

var webAppLib = new WebAppLib ();
