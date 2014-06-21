var pageHandler = new PageHandler ();
var game = new TicTacToeGame ();

function ShowMenu ()
{
	pageHandler.SetToPage (1);
	UpdateMenu ();
	Resize ();
}

function ShowGame ()
{
	pageHandler.SetToPage (0);
	Resize ();
}

function UpdateMenu ()
{
	function CheckImage (imageId, isChecked) {
		var checkImage = 'images/check.png';
		var noCheckImage = 'images/nocheck.png';
		var img = document.getElementById (imageId);
		img.src = (isChecked ? checkImage : noCheckImage);
	}

	var twoPlayers = (game.playersNum == 2);
	CheckImage ('easycheck', !twoPlayers && game.difficulty === 0);
	CheckImage ('mediumcheck', !twoPlayers && game.difficulty == 1);
	CheckImage ('hardcheck', !twoPlayers && game.difficulty == 2);
	CheckImage ('twoplayerscheck', twoPlayers);
}

function Restart ()
{
	ShowGame ();
	game.Reset ();
}

function Continue ()
{
	ShowGame ();
}

function SetDifficulty (difficulty)
{
	ShowGame ();
	game.SetPlayersNum (1);
	game.SetDifficulty (difficulty);
	game.Reset ();
}

function SetTwoPlayers ()
{
	ShowGame ();
	game.SetPlayersNum (2);
	game.Reset ();
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
	
	if (page === 0) {
		var canvas = document.getElementById ('tictactoe');
		canvas.setAttribute ('width', window.innerWidth);
		canvas.setAttribute ('height', window.innerHeight - menu.clientHeight);
		if (game !== null) {
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
	game.Reset ();
};
