QuestionHandler = function ()
{
	this.level = null;
	this.points = null;
	this.question = null;
};

QuestionHandler.prototype =
{
	Init : function ()
	{
		this.Reset ();
	},
	
	Reset : function ()
	{
		this.level = 0;
		this.points = 0;	
	},
	
	GetPoints : function ()
	{
		return this.points;
	},
	
	GenerateQuestion : function ()
	{
		function RandomInt (from, to)
		{
			return Math.floor ((Math.random () * (to - from + 1)) + from); 
		}	
		
		function IsValidAnswer (question, answer, correctAnswer)
		{
			if (answer == correctAnswer) {	
				return false;
			}
		
			var i;
			for (i = 0; i < question.answers.length; i++) {
				if (question.answers[i] == answer) {	
					return false;
				}
			}
			
			return true;
		}
		
		var rangeStart = 0;
		var rangeEnd = 10;
		
		var rangeGrow = 5 * parseInt (this.points / 100, 10);
		rangeStart += rangeGrow;
		rangeEnd += rangeGrow;
		
		var correctAnswer = RandomInt (rangeStart, rangeEnd);
		if (this.question !== null) {
			while (correctAnswer == this.question.correctAnswer) {
				correctAnswer = RandomInt (rangeStart, rangeEnd);
			}
		}
		
		this.question = {};
		this.question.correctAnswer = correctAnswer;
		this.question.question = correctAnswer.toString (2);
		this.question.correct = RandomInt (0, 3);
		this.question.answers = [];
		
		var i, answer;
		for (i = 0; i < 4; i++) {
			if (i == this.question.correct) {
				this.question.answers.push (correctAnswer);
			} else {
				answer = RandomInt (rangeStart, rangeEnd);
				while (!IsValidAnswer (this.question, answer, correctAnswer)) {
					answer = RandomInt (rangeStart, rangeEnd);
				}
				this.question.answers.push (answer);
			}
		}
	},
	
	GetCurrentQuestion : function ()
	{
		return this.question;
	},
	
	AnswerToCurrentQuestion : function (answer, points)
	{
		if (answer != this.question.correct) {
			return false;
		}
		
		this.points += points;
		return true;
	}
};
