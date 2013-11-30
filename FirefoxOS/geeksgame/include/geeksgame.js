var pageHandler = null;
var questionHandler = null;
var timer = null;
var timerValue = null;

function GetNewQuestion ()
{
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
		answer0Div.innerHTML = question.answers[0];
		answer1Div.innerHTML = question.answers[1];
		answer2Div.innerHTML = question.answers[2];
		answer3Div.innerHTML = question.answers[3];
	}

	questionHandler.GenerateQuestion ();
	RenderQuestion ();
}

function StopTimer ()
{
	if (timer !== null) {
		clearTimeout (timer);
	}
}

function BackToMainPage (text)
{
	StopTimer ();
	pageHandler.SetToPage (0);
	Resize ();
	
	var messageText = document.getElementById ('messagetext');
	messageText.innerHTML = '';
	if (text !== undefined) {
		var points = questionHandler.GetPoints ();

		var key = 'GeeksGameHighScore';
		var highScore = window.localStorage.getItem (key);
		
		messageText.innerHTML += text + '<br>';

		var newHighScore = false;
		if (highScore === null) {
			window.localStorage.setItem (key, points);
			newHighScore = true;
		} else if (highScore < points) {
			window.localStorage.setItem (key, points);
			newHighScore = true;
		}

		messageText.innerHTML += '<br>your points: <b>' + points + '</b>';
		if (highScore !== null) {
			messageText.innerHTML += '<br>high score: ' + highScore;
		}
		if (newHighScore) {
			messageText.innerHTML += '<br><br><b>New high score!</b>';
		}
	}
}

function TimerStep ()
{
	timerValue = timerValue - 1;
	if (timerValue < 0) {
		BackToMainPage ('time is up');
		return;
	}
	var countDownDiv = document.getElementById ('countdown');
	countDownDiv.innerHTML = timerValue;
	timer = setTimeout (TimerStep, 1000);
}

function StartTimer ()
{
	StopTimer ();
	timerValue = 20 + 1;
	TimerStep ();
}

function Start ()
{
	questionHandler.Reset ();
	GetNewQuestion ();
	
	pageHandler.SetToPage (1);
	Resize ();
	
	StartTimer ();
}

function Answer (answer)
{
	var succeeded = this.questionHandler.AnswerToCurrentQuestion (answer, timerValue);
	if (succeeded) {
		GetNewQuestion ();
		StartTimer ();
	} else {
		BackToMainPage ('wrong answer');
	}
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
		
		var answersHeight = 2 * answer.clientHeight + 2 * margin;
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
	BackToMainPage ();

	questionHandler = new QuestionHandler ();
	questionHandler.Init ();
	
	window.onresize = Resize;
	Resize ();
}

window.onload = function ()
{
	Load ();
};
