function Restart ()
{
}

function Resize ()
{
	var menu = document.getElementById ('mainmenu');
	var content = document.getElementById ('maincontent');
	var contentHeight = window.innerHeight - menu.clientHeight;
	content.style.height = contentHeight + 'px';

	var statusBar = document.getElementById ('statusbar');
	var question = document.getElementById ('question');
	var answer = document.getElementById ('answer0');

	var padding = 10;
	var margin = 5;
	
	var answersHeight = 2 * answer.clientHeight + 3 * margin;
	question.style.width = window.innerWidth + 'px';
	question.style.height = (contentHeight - statusBar.clientHeight - answersHeight - 2 * padding) + 'px';

	var answers = document.getElementsByClassName ('answer');
	var i;
	for (i = 0; i < answers.length; i++) {
		answer = answers[i];
		answer.style.width = ((window.innerWidth - 4 * padding - 3 * margin) / 2.0) + 'px';
	}
}

function Load ()
{
	window.onresize = Resize;
	Resize ();
}

window.onload = function ()
{
	Load ();
}
