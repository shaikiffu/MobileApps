var pageHandler = null;
var currentShape = null;
var viewer = null;

function GenerateShape ()
{
	if (viewer === null) {	
		return;
	}

	var shapeNames = [
		'Tetrahedron',
		'Hexahedron',
		'Octahedron',
		'Dodecahedron',
		'Icosahedron',
		'TruncatedTetrahedron',
		'Cuboctahedron',
		'TruncatedCube',
		'TruncatedOctahedron',
		'Rhombicuboctahedron',
		'TruncatedCuboctahedron',
		'SnubCube',
		'Icosidodecahedron',
		'TruncatedDodecahedron',
		'TruncatedIcosahedron',
		'Rhombicosidodecahedron',
		'TruncatedIcosidodecahedron',
		'SnubDodecahedron',
		'TetrakisHexahedron',
		'RhombicDodecahedron',
		'PentakisDodecahedron',
		'SmallStellatedDodecahedron',
		'GreatDodecahedron',
		'SmallTriambicIcosahedron',
		'GreatStellatedDodecahedron',
		'SmallTriakisOctahedron',
		'StellaOctangula',
		'TriakisTetrahedron'
	];

	var body = JSM.GenerateSolidWithRadius (shapeNames[currentShape], 1.0);
	
	var materials = new JSM.Materials ();
	materials.AddMaterial (new JSM.Material (0x008ab8, 0x008ab8));
	materials.AddMaterial (new JSM.Material (0x279b61, 0x279b61));
	materials.AddMaterial (new JSM.Material (0xcc3333, 0xcc3333));

	var vertexCountToColor = [];
	var currentColor = 0;
		
	var i, polygon, vertexCount;
	for (i = 0; i < body.PolygonCount (); i++) {
		polygon = body.GetPolygon (i);
		vertexCount = polygon.VertexIndexCount ();
		if (vertexCountToColor[vertexCount] === undefined) {
			vertexCountToColor[vertexCount] = currentColor;
			currentColor++;
		}
		polygon.SetMaterialIndex (vertexCountToColor[vertexCount]);
	}

	var meshes = JSM.ConvertBodyToThreeMeshes (body, materials);
	viewer.RemoveMeshes ();
	for (var i = 0; i < meshes.length; i++) {
		viewer.AddMesh (meshes[i]);
	}
	viewer.FitInWindow ();
}

function SetCurrentShape (index)
{
	currentShape = index;
	BackToMain ();
}

function ShowProgressBar (show)
{
	var progressBar = document.getElementById ('progressbar');
	var canvas = document.getElementById ('viewer');
	if (show) {
		progressBar.style.display = 'block';
		canvas.style.display = 'none';
	} else {
		progressBar.style.display = 'none';
		canvas.style.display = 'block';
	}
}

function BackToMain ()
{
	pageHandler.SetToPage (0);
	Resize ();
	
	ShowProgressBar (true);
	setTimeout (function () {
		GenerateShape ();
		ShowProgressBar (false);
	}, 50);
}

function ShowShapeList ()
{
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
	content.style.width = window.innerWidth + 'px';
	content.style.height = (window.innerHeight - menu.clientHeight) + 'px';
	
	if (page == 0) {
		var canvas = document.getElementById ('viewer');
		canvas.setAttribute ('width', window.innerWidth);
		canvas.setAttribute ('height', window.innerHeight - menu.clientHeight);
		if (viewer != null) {
			viewer.Resize ();
			if (viewer.MeshCount () > 0) {
				viewer.FitInWindow ();
			}
		}
	}
}

function Load ()
{
	pageHandler = new PageHandler ();

	var viewerSettings = {
		cameraEyePosition : [-2.0, -1.5, 1.0],
		cameraCenterPosition : [0.0, 0.0, 0.0],
		cameraUpVector : [0, 0, 1],
		cameraDisableZoom : true,
		cameraFixUp : false
	};

	var success = false;
	try {
		viewer = new JSM.Viewer ();
		success = viewer.Start ('viewer', viewerSettings);
	} catch (ex) {
		success = false;
	}

	if (!success) {
		viewer = null;
		alert ('Error: Your browser does not support WebGL.');
	}

	currentShape = 1;
	window.onresize = Resize;
	BackToMain ();
}

window.onload = function ()
{
	Load ();			
}
