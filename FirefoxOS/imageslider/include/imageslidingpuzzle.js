ImageSlidingPuzzle = function ()
{
	this.slider = null;
	this.onWin = null;
	this.image = null;
	this.numbers = null;
};

ImageSlidingPuzzle.prototype =
{
	Init : function (parentDiv, onWin)
	{
		var callbacks = new SlidingPuzzleCallbacks ();
		callbacks.onTileCreated = this.OnTileCreated.bind (this);
		callbacks.onTileResized = this.OnTileResized.bind (this);
		callbacks.onWin = this.OnWin.bind (this);
		
		this.slider = new SlidingPuzzle ();
		this.slider.Init (parentDiv, callbacks);
		this.onWin = onWin;
		this.numbers = false;
	},
	
	Generate : function (tableCount)
	{
		this.slider.Generate (tableCount);
	},
	
	Shuffle : function (steps)
	{
		this.slider.Shuffle (steps);
	},
	
	ShowNumbers : function (showNumbers)
	{
		this.numbers = showNumbers;
		this.UpdateImageOnTiles ();
	},
	
	Enable : function (enable)
	{
		this.slider.Enable (enable);
	},
	
	Resize : function ()
	{
		this.slider.Resize ();
	},
	
	SetImage : function (image)
	{
		this.image = image;
		this.UpdateImageOnTiles ();
	},

	OnTileCreated : function (tile, row, column, empty)
	{
		if (!empty) {
			var canvas = document.createElement ('canvas');
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
		canvas.width = parseInt (tile.style.width, 10) - 1;
		canvas.height = parseInt (tile.style.height, 10) - 1;
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
		var row = parseInt (index / this.slider.tileCount, 10);
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
			startX = parseInt (0, 10);
			startY = parseInt ((imageHeight - xRatio * tableHeight) / 2, 10);
			endX = imageWidth;
			endY = imageHeight - startY;
			tileX = parseInt ((endX - startX) / this.slider.tileCount, 10);
			tileY = parseInt ((endY - startY) / this.slider.tileCount, 10);
		} else {
			startX = parseInt ((imageWidth - yRatio * tableWidth) / 2, 10);
			startY = parseInt (0, 10);
			endX = imageWidth - startX;
			endY = imageHeight;
			tileX = parseInt ((endX - startX) / this.slider.tileCount, 10);
			tileY = parseInt ((endY - startY) / this.slider.tileCount, 10);
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
		
		if (this.numbers) {
			var textX = 10;
			var textY = 30;
			context.fillStyle = '#ffffff';
			context.font = 'bold 25px Arial';
			context.fillText ((tile.slideIndex + 1), textX, textY);		

			context.fillStyle = '#ffffff';
			context.lineWidth = 1;
			context.strokeStyle = '#000000';
			context.strokeText ((tile.slideIndex + 1), textX, textY);		
		}
	},

	OnWin : function ()
	{
		if (this.onWin !== null) {
			this.onWin ();
		}
	}
};
