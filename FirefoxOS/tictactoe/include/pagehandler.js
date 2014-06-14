PageHandler = function ()
{
	this.pages = document.getElementsByClassName ('page');
	this.prevPage = -1;
	this.currPage = -1;
};

PageHandler.prototype =
{
	GetPage : function ()
	{
		return this.currPage;
	},
	
	SetToPage : function (index)
	{
		var i, page;
		for (i = 0; i < this.pages.length; i++) {
			page = this.pages[i];
			if (i == index) {
				page.style.display = 'block';
			} else {
				page.style.display = 'none';
			}
		}
		this.prevPage = this.currPage;
		this.currPage = index;
	},
	
	SetToPrevPage : function ()
	{
		if (this.prevPage != -1) {
			this.SetToPage (this.prevPage);
		}
	}
};
