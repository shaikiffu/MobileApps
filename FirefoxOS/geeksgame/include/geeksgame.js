var pageHandler = null;
var questionHandler = null;

function RenderQuestion ()
{
	var question = questionHandler.GetCurrentQuestion ();
	
	var pointsDiv = document.getElementById ('points');
	var questionDiv = document.getElementById ('question');
	var answer0Div = document.getElementById ('answer0');
	var answer1Div = document.getElementById ('answer1');
	var answer2Div = document.getElementById ('answer2');
	var answer3Div = document.getElementById ('answer3');

	pointsDiv.innerHTML = 'points: ' + questionHandler.GetPoints ();
	questionDiv.innerHTML = question.question;
	answer0Div.innerHTML = question.answer0;
	answer1Div.innerHTML = question.answer1;
	answer2Div.innerHTML = question.answer2;
	answer3Div.innerHTML = question.answer3;
}

function Start ()
{
	questionHandler.Reset ();
	var question = questionHandler.GenerateQuestion ();
	RenderQuestion ();

	pageHandler.SetToPage (1);
	Resize ();
}

function Resize ()
{
	var page = pageHandler.GetPage ();
	var menus = document.getElementsByClassName ('menu');
	var contents = document.getElementsByClassName ('content');

	var menu = menus[page];
	var content = contents[page];

	var contentHeight = window.innerHeight - menu.clientHeight;
	content.style.height = contentHeight + 'px';

	if (page === 0) {
	} else if (page == 1) {
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
}

function Load ()
{
	pageHandler = new PageHandler ();
	pageHandler.SetToPage (0);

	questionHandler = new QuestionHandler ();
	questionHandler.Init ();
	
	window.onresize = Resize;
	Resize ();
}

window.onload = function ()
{
	Load ();
}
