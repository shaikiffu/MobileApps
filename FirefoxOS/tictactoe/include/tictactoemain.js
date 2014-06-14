var pageHandler = new PageHandler ();
var game = new TicTacToeGame ();

function ShowMenu ()
{
	pageHandler.SetToPage (1);
	Resize ();
}

function ShowGame ()
{
	pageHandler.SetToPage (0);
	Resize ();
}

function Restart ()
{
	ShowGame ();
	game.Reset (-1);
}

function Continue ()
{
	ShowGame ();
}

function SetDifficulty (difficulty)
{
	ShowGame ();
	game.Reset (difficulty);
}

function Resize ()
{
	var page = pageHandler.GetPage ();
	var menus = document.getElementsByClassName ('menu');
	var contents = document.getElementsByClassName ('content');
	
	var menu = menus[page];
	var content = contents[page];
	content.style.width = window.innerWidth + 'px';
	content.style.height = (window.innerHeight - menu.clientHeight) + 'px';
	
	if (page == 0) {
		var canvas = document.getElementById ('tictactoe');
		canvas.setAttribute ('width', window.innerWidth);
		canvas.setAttribute ('height', window.innerHeight - menu.clientHeight);
		if (game != null) {
			game.Resize ();
		}
	}
}

window.onload = function ()
{
	pageHandler.SetToPage (0);
	window.onresize = Resize;
	Resize ();

	game = new TicTacToeGame ();
	game.Initialize ('tictactoe');
	game.Reset (1);
}
