var pageHandler = null;
var slider = null;
var settings = {
	tileCount : 3,
	image : null,
	loaded : false,
	numbers : false
};

function ShowMainPage ()
{
	pageHandler.SetToPage (0);
	Resize ();
}

function ShowSettings ()
{
	pageHandler.SetToPage (1);
	var showNumbersDiv = document.getElementById ('shownumbers');
	showNumbersDiv.innerHTML = settings.numbers ? 'hide numbers' : 'show numbers';
	Resize ();
}

function SelectImage ()
{
	try {
		var activity = new MozActivity ({
			name: 'pick',
			data: {
				type: ["image/jpg", "image/jpeg", "img/png"]
			}
		});
		activity.onsuccess = function () {
			ShowMainPage ();
			settings.loaded = false;
			SetNewImage (URL.createObjectURL (this.result.blob));
		}

		activity.onerror = function () {
		}
	} catch (ex) {
		alert ('This is not supported on your device.');
	}
}

function Restart ()
{
	SetNewImage ();
	ShowMainPage ();
}

function ChangeSize (size)
{
	settings.tileCount = size;
	Restart ();
}

function ShowNumbers ()
{
	settings.numbers = !settings.numbers;
	slider.ShowNumbers (settings.numbers);
	slider.UpdateImageOnTiles ();
	ShowMainPage ();
}

function OnWin ()
{
	alert ('Congratulations!');
	slider.Enable (false);
}

function SetNewImage (imageUrl)
{
	function ImageLoaded (image)
	{
		function Shuffle ()
		{
			slider.Shuffle (50);
			slider.Enable (true);
		}

		slider.SetImage (image);
		slider.Enable (false);
		
		setTimeout (Shuffle, 2000);
	}

	slider.Generate (settings.tileCount);
	
	if (!settings.loaded || imageUrl !== undefined) {
		settings.image = new Image ();
		settings.image.src = imageUrl;
		settings.image.onload = function () {
			settings.loaded = true;
			ImageLoaded (this);
		};
	} else {
		ImageLoaded (settings.image);
	}
}

function Resize ()
{
	var page = pageHandler.GetPage ();
	var menus = document.getElementsByClassName ('menu');
	var contents = document.getElementsByClassName ('content');
	
	var menu = menus[page];
	var content = contents[page];
	
	if (page == 0) {
		var margin = 20;
		var newWidth = window.innerWidth - margin;
		var newHeight = window.innerHeight - menu.clientHeight - margin;
		content.style.width = (newWidth - newWidth % settings.tileCount) + 'px';
		content.style.height = (newHeight - newHeight % settings.tileCount) + 'px';
		content.style.margin = (margin / 2) + 'px';
		if (slider !== null) {
			slider.Resize ();
		}
	} else {
		content.style.width = window.innerWidth + 'px';
		content.style.height = (window.innerHeight - menu.clientHeight) + 'px';
	}
}

function Load ()
{
	pageHandler = new PageHandler ();
	pageHandler.SetToPage (0);

	window.onresize = Resize;
	Resize ();

	var table = document.getElementById ('table');
	slider = new ImageSlidingPuzzle ();
	slider.Init (table, OnWin);
	slider.ShowNumbers (settings.numbers);
	SetNewImage ('firefoxos.png');
}

window.onload = function ()
{
	Load ();
}
