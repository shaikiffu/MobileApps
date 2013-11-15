ImageSliderPuzzle = function ()
{
	this.slider = null;
	this.image = null;
};

ImageSliderPuzzle.prototype =
{
	Init : function (parentDiv)
	{
		this.slider = new SliderPuzzle ();
		var callbacks = new SliderPuzzleCallbacks ();
		callbacks.onTileCreated = this.OnTileCreated.bind (this);
		callbacks.onTileResized = this.OnTileResized.bind (this);
		callbacks.onWin = this.OnWin.bind (this);
		
		this.slider.Init (parentDiv, callbacks);
	},
	
	Generate : function (tableCount)
	{
		this.slider.Generate (tableCount);
		this.UpdateImage ();
	},
	
	Resize : function ()
	{
		this.slider.Resize ();
	},
	
	UpdateImage : function ()
	{
		this.image = new Image();
		this.image.src = "Koala.jpg";
		this.image.onload = this.UpdateImageOnTiles.bind (this);
	},

	OnTileCreated : function (tile, row, column, empty)
	{
		if (!empty) {
			var canvas = document.createElement ('canvas');
			canvas.style.border = '1px solid #000000';
			this.SetCanvasSize (tile, canvas);
			tile.appendChild (canvas);
		}
	},
	
	OnTileResized : function (tile, row, column, empty)
	{
		if (empty) {
		} else {
			var canvas = tile.firstChild;
			this.SetCanvasSize (tile, canvas);
			this.UpdateImageOnTile (tile);
		}
	},
	
	SetCanvasSize : function (tile, canvas)
	{
		canvas.width = parseInt (tile.style.width) - 2;
		canvas.height = parseInt (tile.style.height) - 2;
	},
	
	UpdateImageOnTiles : function ()
	{
		if (this.image === null) {
			return;
		}
	
		var i, tile;
		for (i = 0; i < this.slider.tiles.length; i++) {
			tile = this.slider.tiles[i];
			this.UpdateImageOnTile (tile);
		}
	},

	UpdateImageOnTile : function (tile)
	{
		if (this.image === null) {
			return;
		}

		var index = tile.slideIndex;
		if (index == -1) {
			return;
		}
		
		var canvas = tile.firstChild;
		var context = canvas.getContext ('2d');
		var row = parseInt (index / this.slider.tileCount);
		var column = index % this.slider.tileCount;
		
		var imageWidth = this.image.width;
		var imageHeight = this.image.height;
		var tableWidth = this.slider.parentDiv.clientWidth;
		var tableHeight = this.slider.parentDiv.clientHeight;
		var canvasWidth = canvas.width;
		var canvasHeight = canvas.height;
		
		var xRatio = imageWidth / tableWidth;
		var yRatio = imageHeight / tableHeight;
		
		var startX, startY, endX, endY, tileX, tileY;
		if (xRatio <= yRatio) {
			startX = parseInt (0);
			startY = parseInt ((imageHeight - xRatio * tableHeight) / 2);
			endX = imageWidth;
			endY = imageHeight - startY;
			tileX = parseInt ((endX - startX) / this.slider.tileCount);
			tileY = parseInt ((endY - startY) / this.slider.tileCount);
		} else {
			startX = parseInt ((imageWidth - yRatio * tableWidth) / 2);
			startY = parseInt (0);
			endX = imageWidth - startX;
			endY = imageHeight;
			tileX = parseInt ((endX - startX) / this.slider.tileCount);
			tileY = parseInt ((endY - startY) / this.slider.tileCount);
		}
		
		context.drawImage (this.image,
			startX + column * tileX,
			startY + row * tileY,
			tileX,
			tileY,
			0,
			0,
			canvasWidth,
			canvasHeight);
	},

	OnWin : function ()
	{
		alert ('win');
	}
};
