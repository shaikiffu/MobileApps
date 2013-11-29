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
		this.question = {};
		this.question.question = 'q';
		this.question.answer0 = 'a';
		this.question.answer1 = 'b';
		this.question.answer2 = 'c';
		this.question.answer3 = 'd';
	},
	
	GetCurrentQuestion : function ()
	{
		return this.question;
	}
};
