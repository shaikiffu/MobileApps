TicTacToeGame = function ()
{
	this.viewer = null;
	this.ticTacToe = null;
	this.mouseMoved = null;
	this.hasWinner = null;
	this.error = null;
};

TicTacToeGame.prototype.Initialize = function (canvasName)
{
	this.ticTacToe = new TicTacToe ();

	var viewerSettings = {
		cameraEyePosition : [14.0, -14.0, 16.0],
		cameraCenterPosition : [3.0, 3.0, 3.0],
		cameraUpVector : [0.0, 0.0, 1.0],
	};

	var viewerCallbacks = {
		onDrawStart : this.OnDrawStart.bind (this),
		onPointDraw : this.OnPointDraw.bind (this),
		onDrawEnd : this.OnDrawEnd.bind (this)
	};

	var canvas = document.getElementById (canvasName);
	if (canvas.addEventListener) {
		var myThis = this;
		canvas.addEventListener ('mousedown', function (event) {myThis.OnMouseDown (event);}, false);
		canvas.addEventListener ('mousemove', function (event) {myThis.OnMouseMove (event);}, false);
		canvas.addEventListener ('mouseup', function (event) {myThis.OnMouseUp (event);}, false);
		//canvas.addEventListener ('touchstart', function (event) {myThis.OnTouchStart (event);}, false);
		//canvas.addEventListener ('touchmove', function (event) {myThis.OnTouchMove (event);}, false);
		//canvas.addEventListener ('touchend', function (event) {myThis.OnTouchEnd (event);}, false);
	}

	this.mouseMoved = false;
	this.error = false;

	this.viewer = new JSM.SpriteViewer ();
	if (!this.viewer.Start (canvasName, viewerSettings, viewerCallbacks)) {
		this.error = true;
		return;
	}
	
	this.viewer.camera.SetZoomEnabled (false);
};

TicTacToeGame.prototype.OnDrawStart = function (canvas)
{
	var context = canvas.getContext ('2d');
	context.clearRect (0, 0, canvas.width, canvas.height);
};

TicTacToeGame.prototype.OnPointDraw = function (canvas, index, projected)
{
	var context = canvas.getContext ('2d');
	var x = projected.x;
	var y = projected.y;
	
	var minCanvasSize = JSM.Minimum (canvas.width, canvas.height);
	var greatRadius = minCanvasSize / 10.0;
	var radius = greatRadius / 4.0;
	var fromColor = '#eeeeee';
	var toColor = '#cccccc';
	
	var player = this.ticTacToe.GetPlayerWithIndex (index);
	if (player == 1) {
		radius = greatRadius;
		fromColor = '#00a1d1';
		toColor = '#00769f';
	} else if (player == 2) {
		radius = greatRadius;
		fromColor = '#e23c3c';
		toColor = '#b32c2c';
	}
	
	context.beginPath ();
	var radialGradient = context.createRadialGradient (x, y, 0, x, y, radius);
	radialGradient.addColorStop (0, fromColor);
	radialGradient.addColorStop (1, toColor);

	context.beginPath ();
	context.arc (x, y, radius, 0.0, 2.0 * Math.PI, false);
	context.fillStyle = radialGradient;
	context.fill ();
	context.closePath ();
};

TicTacToeGame.prototype.OnDrawEnd = function (canvas)
{

};

TicTacToeGame.prototype.Reset = function (difficulty)
{
	if (this.error) {
		return;
	}
	
	if (difficulty == -1) {
		difficulty = 1;
		if (this.ticTacToe !== null) {
			difficulty = this.ticTacToe.GetDifficulty ();
		}
	}
	this.ticTacToe.Initialize (3, difficulty);
	
	this.viewer.RemovePoints ();
	
	var offset = this.ticTacToe.shapeSize * 1.5;
	var i, j, k;
	for (k = 0; k < this.ticTacToe.zSize; k++) {
		for (j = 0; j < this.ticTacToe.ySize; j++) {
			for (i = 0; i < this.ticTacToe.xSize; i++) {
				this.viewer.AddPoint (new JSM.Coord (offset * i, offset * j, offset * k));
			}
		}
	}
	
	this.hasWinner = false;
	this.FitInWindow ();
};

TicTacToeGame.prototype.UserStep = function (index)
{
	if (this.hasWinner) {
		return;
	}		

	if (this.ticTacToe.GetPlayerWithIndex (index) !== 0) {
		return;
	}

	var player, step;
	for (player = 1; player <= 2; player++) {
		if (player == 1) {
			step = index;
		} else if (player == 2) {
			step = this.ticTacToe.CalculateComputerStep ();
		}
		this.ticTacToe.StepWithIndex (player, step);
		winner = this.ticTacToe.GetWinner ();
		if (winner != -1) {
			this.hasWinner = true;
			break;
		}
	}
	this.viewer.Draw ();
};

TicTacToeGame.prototype.FitInWindow = function ()
{
	var center = this.viewer.GetCenter ();
	var radius = this.viewer.GetBoundingSphereRadius () + this.ticTacToe.shapeSize * 0.5;
	this.viewer.FitInWindowWithCenterAndRadius (center, radius);
};

TicTacToeGame.prototype.Resize = function ()
{
	if (this.viewer !== null) {
		this.FitInWindow ();
	}
};

TicTacToeGame.prototype.OnMouseDown = function (event)
{
	this.mouseMoved = false;
};

TicTacToeGame.prototype.OnMouseMove = function (event)
{
	this.mouseMoved = true;
};

TicTacToeGame.prototype.OnMouseUp = function (event)
{
	if (!this.mouseMoved) {
		var index = this.viewer.NearestPointUnderMouse (50);
		if (index != -1) {
			this.UserStep (index);
		}
	}
	
	this.mouseMoved = false;
};

TicTacToeGame.prototype.OnTouchStart = function (event)
{
	this.mouseMoved = false;
};

TicTacToeGame.prototype.OnTouchMove = function (event)
{
	this.mouseMoved = true;
};

TicTacToeGame.prototype.OnTouchEnd = function (event)
{
	if (!this.mouseMoved) {
		var index = this.viewer.NearestPointUnderTouch (50);
		if (index != -1) {
			this.UserStep (index);
		}
	}
	
	this.mouseMoved = false;
};
