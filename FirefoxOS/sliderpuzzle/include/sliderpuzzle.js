SliderPuzzleCallbacks = function ()
{
	this.onTileCreated = null;
	this.onTileResized = null;
	this.onWin = null;
};

SliderPuzzle = function ()
{
	this.parentDiv = null;
	this.callbacks = null;
	this.enable = null;
	
	this.tiles = null;
	this.tileCount = null;
	this.tileSizeX = null;
	this.tileSizeY = null;
	
	this.movementData = null;
};

SliderPuzzle.prototype =
{
	Init : function (parentDiv, callbacks)
	{
		this.parentDiv = parentDiv;
		this.callbacks = callbacks;
		if (this.callbacks === undefined || this.callbacks === null) {
			this.callbacks = new SliderPuzzleCallbacks ();
		}
		this.enable = true;
	},
	
	Generate : function (tileCount)
	{
		while (this.parentDiv.firstChild) {
			this.parentDiv.removeChild (this.parentDiv.firstChild);
		}
		
		this.tileCount = tileCount;
		this.CalculateTileSize ();
		
		this.tiles = [];
		var i, j, tile, last;
		for (i = 0; i < this.tileCount; i++) {
			for (j = 0; j < this.tileCount; j++) {
				tile = document.createElement ('div');
				tile.style.position = 'absolute';
				last = (i == this.tileCount - 1 && j == this.tileCount - 1);
				if (last) {
					tile.style.zIndex = 0;
					tile.slideIndex = -1;
				} else {
					tile.slideIndex = this.GetIndex (i, j);
					tile.style.zIndex = 1;
				}
				this.SetTilePosition (tile, i, j);
				this.AddEvents (tile);
				
				if (this.callbacks.onTileCreated !== null) {
					this.callbacks.onTileCreated (tile, i, j, last);
				}
				this.parentDiv.appendChild (tile);
				this.tiles.push (tile);
			}
		}
	},
	
	Shuffle : function (steps)
	{
		function RandomInt (from, to)
		{
			return Math.floor ((Math.random () * (to - from + 1)) + from); 
		}
		
		var row, column;
		var i, j, tile;

		for (i = 0; i < this.tileCount; i++) {
			for (j = 0; j < this.tileCount; j++) {
				tile = this.tiles[this.GetIndex (i, j)];
				if (tile.slideIndex == -1) {
					row = i;
					column = j;
					break;
				}
			}
		}

		var directions = [];
		var direction = [0, 0];
		
		var left = [0, -1];
		var right = [0, 1];
		var top = [-1, 0];
		var bottom = [1, 0];
		
		for (i = 0; i < steps; i++) {
			directions = [];
			if (this.GetTile (row, column - 1) !== null) {
				if (direction.toString () != right.toString ()) {
					directions.push (left);
				}
			}
			if (this.GetTile (row, column + 1) !== null) {
				if (direction.toString () != left.toString ()) {
					directions.push (right);
				}
			}
			if (this.GetTile (row - 1, column) !== null) {
				if (direction.toString () != bottom.toString ()) {
					directions.push (top);
				}
			}
			if (this.GetTile (row + 1, column) !== null) {
				if (direction.toString () != top.toString ()) {
					directions.push (bottom);
				}
			}
			
			if (directions.length === 0) {
				continue;
			}
			
			direction = directions[RandomInt (0, directions.length - 1)];
			this.SwapTiles (row, column, row + direction[0], column + direction[1]);
			row = row + direction[0];
			column = column + direction[1];
		}
	},
	
	Enable : function (enable)
	{
		this.enable = enable;
	},

	Resize : function ()
	{
		this.CalculateTileSize ();
		
		var i, j, tile;
		for (i = 0; i < this.tileCount; i++) {
			for (j = 0; j < this.tileCount; j++) {
				tile = this.tiles[this.GetIndex (i, j)];
				this.SetTilePosition (tile, i, j);
				if (this.callbacks.onTileResized !== null) {
					this.callbacks.onTileResized (tile, i, j, tile.slideIndex == -1);
				}
			}
		}
	},
	
	CalculateTileSize : function ()
	{
		this.tileSizeX = parseInt (this.parentDiv.clientWidth / this.tileCount, 10);
		this.tileSizeY = parseInt (this.parentDiv.clientHeight / this.tileCount, 10);
	},
	
	AddEvents : function (tile)
	{
		var myThis = this;
		tile.addEventListener ('mousedown', function (event) {myThis.OnMouseDown (event);});		
		tile.addEventListener ('mouseup', function (event) {myThis.OnMouseUp (event);});
		tile.addEventListener ('mouseout', function (event) {myThis.OnMouseUp (event);});
		tile.addEventListener ('mousemove', function (event) {myThis.OnMouseMove (event);});
		tile.addEventListener ('touchstart', function (event) {myThis.OnTouchStart (event);});
		tile.addEventListener ('touchmove', function (event) {myThis.OnTouchMove (event);});
		tile.addEventListener ('touchend', function (event) {myThis.OnTouchEnd (event);});
		tile.addEventListener ('touchleave', function (event) {myThis.OnTouchEnd (event);});
		tile.addEventListener ('touchcancel', function (event) {myThis.OnTouchEnd (event);});
	},
	
	FindRowColumn : function (x, y)
	{
		var row = parseInt (y / this.tileSizeY, 10);
		var column = parseInt (x / this.tileSizeX, 10);
		return [row, column];
	},
	
	GetIndex : function (row, column)
	{
		return column + row * this.tileCount;
	},
	
	GetTile : function (row, column)
	{
		if (row < 0 || row >= this.tileCount || column < 0 || column >= this.tileCount) {
			return null;
		}
		var index = this.GetIndex (row, column);
		return this.tiles[index];
	},
	
	IsEmptyTile : function (row, column)
	{
		var tile = this.GetTile (row, column);
		if (tile === null) {
			return false;
		}
		return tile.slideIndex == -1;
	},
	
	GetMoveDirection : function (row, column)
	{
		var moveDirection = null;
		if (this.IsEmptyTile (row, column - 1)) {
			moveDirection = [0, -1];
		} else if (this.IsEmptyTile (row, column + 1)) {
			moveDirection = [0, 1];
		} else if (this.IsEmptyTile (row - 1, column)) {
			moveDirection = [-1, 0];
		} else if (this.IsEmptyTile (row + 1, column)) {
			moveDirection = [1, 0];
		}
		return moveDirection;
	},
	
	SwapTiles : function (fromRow, fromColumn, toRow, toColumn)
	{
		from = this.GetIndex (fromRow, fromColumn);
		to = this.GetIndex (toRow, toColumn);
		var temp = this.tiles[from];
		this.tiles[from] = this.tiles[to];
		this.tiles[to] = temp;
		this.SetTilePosition (this.tiles[from], fromRow, fromColumn);
		this.SetTilePosition (this.tiles[to], toRow, toColumn);
	},
	
	SetTilePosition : function (tile, row, column)
	{
		tile.style.width = this.tileSizeX + 'px';
		tile.style.height = this.tileSizeY + 'px';
		tile.style.left = (this.parentDiv.offsetLeft + column * this.tileSizeX) + 'px';
		tile.style.top = (this.parentDiv.offsetTop + row * this.tileSizeY) + 'px';
	},
	
	IsWin : function ()
	{
		var win = true;
		var i;
		for (i = 0; i < this.tiles.length - 1; i++) {
			if (this.tiles[i].slideIndex != i) {
				win = false;
				break;
			}
		}
		return win;
	},
	
	OnMouseDown : function (event)
	{
		event.preventDefault ();
		var x = event.clientX - this.parentDiv.offsetLeft;
		var y = event.clientY - this.parentDiv.offsetTop;
		this.OnInputStart (x, y);
	},

	OnMouseMove : function (event)
	{
		event.preventDefault ();
		var x = event.clientX - this.parentDiv.offsetLeft;
		var y = event.clientY - this.parentDiv.offsetTop;
		this.OnInputMove (x, y);
	},
	
	OnMouseUp : function (event)
	{
		event.preventDefault ();
		this.OnInputEnd ();
	},

	OnTouchStart : function (event)
	{
		event.preventDefault ();
		if (event.touches.length === 0) {
			return;
		}
		var touch = event.touches[0];  
		var x = touch.pageX - this.parentDiv.offsetLeft;
		var y = touch.pageY - this.parentDiv.offsetTop;
		this.OnInputStart (x, y);
	},

	OnTouchMove : function (event)
	{
		event.preventDefault ();
		if (event.touches.length === 0) {
			return;
		}
		var touch = event.touches[0];  
		var x = touch.pageX - this.parentDiv.offsetLeft;
		var y = touch.pageY - this.parentDiv.offsetTop;
		this.OnInputMove (x, y);
	},
	
	OnTouchEnd : function (event)
	{
		event.preventDefault ();
		this.OnInputEnd ();
	},

	OnInputStart : function (x, y)
	{
		if (!this.enable) {	
			return;
		}
	
		this.movementData = null;
		var rowAndColumn = this.FindRowColumn (x, y);
		if (rowAndColumn === null) {
			return;
		}
		
		var tile = this.GetTile (rowAndColumn[0], rowAndColumn[1]);
		if (tile === null) {
			return;
		}
		
		var moveDirection = this.GetMoveDirection (rowAndColumn[0], rowAndColumn[1]);
		if (moveDirection === null) {
			return;
		}
		
		this.movementData = {
			origX : x,
			origY : y,
			origRow : rowAndColumn[0],
			origColumn : rowAndColumn[1],
			tile : tile,
			origTileLeft : parseInt (tile.style.left, 10),
			origTileTop : parseInt (tile.style.top, 10),
			hasMoved : false,
			moveDirection : moveDirection
		};		
	},
	
	OnInputMove : function (x, y)
	{
		function MoveTile (moveDir, origPos, currMousePos, origMousePos, tileSize)
		{
			function GetMin (origMin, moveDir, tileSize)
			{
				if (moveDir == -1) {
					return origMin - tileSize;
				}
				return origMin;
			}
		
			function GetMax (origMin, moveDir, tileSize)
			{
				if (moveDir == -1) {
					return origMin;
				}
				return origMin + tileSize;
			}

			var min = GetMin (origPos, moveDir, tileSize);
			var max = GetMax (origPos, moveDir, tileSize);
			var newPos = origPos + (currMousePos - origMousePos);
			if (newPos < min) {
				newPos = min;
			} else if (newPos > max) {
				newPos = max;
			}
			return newPos;		
		}
		
		if (!this.enable) {	
			return;
		}

		if (this.movementData === null) {
			return;
		}
		
		var newTileLeft, newTileTop, moveDir, min, max;
		if (this.movementData.moveDirection[0] === 0 && this.movementData.moveDirection[1] !== 0) {
			moveDir = this.movementData.moveDirection[1];
			newTileLeft = MoveTile (moveDir, this.movementData.origTileLeft, x, this.movementData.origX, this.tileSizeX);
			this.movementData.hasMoved = Math.abs (newTileLeft - this.movementData.origTileLeft) > this.tileSizeX / 2.0;
			this.movementData.tile.style.left = newTileLeft + 'px';
		} else if (this.movementData.moveDirection[0] !== 0 && this.movementData.moveDirection[1] === 0) {
			moveDir = this.movementData.moveDirection[0];
			newTileTop = MoveTile (moveDir, this.movementData.origTileTop, y, this.movementData.origY, this.tileSizeY);
			this.movementData.hasMoved = Math.abs (newTileTop - this.movementData.origTileTop) > this.tileSizeY / 2.0;
			this.movementData.tile.style.top = newTileTop + 'px';
		}
	},
	
	OnInputEnd : function ()
	{
		if (!this.enable) {	
			return;
		}

		if (this.movementData === null) {
			return;
		}
		
		var win = false;
		if (!this.movementData.hasMoved) {
			this.movementData.tile.style.left = this.movementData.origTileLeft + 'px';
			this.movementData.tile.style.top = this.movementData.origTileTop + 'px';
		} else {
			this.SwapTiles (
				this.movementData.origRow,
				this.movementData.origColumn,
				this.movementData.origRow + this.movementData.moveDirection[0],
				this.movementData.origColumn + this.movementData.moveDirection[1]);
			win = this.IsWin ();
		}
		this.movementData = null;
		
		if (win && this.callbacks.onWin !== null) {
			this.callbacks.onWin ();
		}
	}
};
