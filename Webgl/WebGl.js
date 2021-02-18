"use strict"; // https://stackoverflow.com/q/1335851/72470

// Global variables that are available in all functions.
// Note: You can add your own here, e.g. to store the rendering mode.

//world setup
var camera, scene, renderer;
var axisHelper, grid, ambient; 
// objects in scene
var cube, wireframe, points, _3dObj, _3dWireframe, _3dPoints;
// object state (rotating or not) and about what axes
var axes, rotating = false
// lights
var directionalLight, lightHelper;
// camera rotation
var camVector;
// current position in spherical coordinates
var start = new THREE.Vector2(), end = new THREE.Vector2();
var delta = new THREE.Vector2();
var spherical = new THREE.Spherical();
var sphericalDelta = new THREE.Spherical();
// state of the mouse
var down = false;
// camera obriting motion
var orbiting = false;
// location of focus, point the object will orbit about 
var target = new THREE.Vector3();
// state of camera transformation
var panOffset = new THREE.Vector3();

// something cool requirements variables here
var cool = false;
// head object var
var head;
// bcakGround object
var backGround , backGround1;
// light variables
var spotLight, hemiLight, pointLight, pointLight2;
// animation state variable
var paused = false;
// size of background cubes
var size = 20;




// Initialise the scene, and draw it for the first time.
init();
animate();


// Listen for keyboard events, to react to them.
// Note: there are also other event listeners, e.g. for mouse events.
document.addEventListener('keydown', handleKeyDown);

// add event listener for mouse inputs
document.addEventListener( 'mousedown', onMouseDown );
document.addEventListener( 'mouseup', onMouseUp );
document.addEventListener( 'mousemove', onMouseMove );


// Scene initialisation. This function is only run once, at the very beginning.
function init()
{
	scene = new THREE.Scene();

	// Set up the camera, move it to (3, 4, 5) and look at the origin (0, 0, 0).
	camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
	camera.position.set(3, 4, 5);

	camera.lookAt(new THREE.Vector3(0, 0, 0));
 
	// Draw a helper grid in the x-z plane (note: y is up).
	grid =new THREE.GridHelper(10, 20, 0xffffff);
	scene.add(grid);

	// TO DO: mode rendering (requirement 4).
	var geometry = new THREE.BoxGeometry( 2, 2, 2 );

	var eMaterial = new THREE.MeshBasicMaterial( {
		color: 0xffff00, wireframe: true } );
	wireframe = new THREE.Mesh( geometry, eMaterial);
	// draw the vertices
	var vMaterial = new THREE.PointsMaterial( {
		size: 0.1, color: 0xffff00});
	points = new THREE.Points( geometry, vMaterial );

	// loading texture
	var loader = new THREE.TextureLoader();
	loader.setPath( 'texture/' );
	var cubeF = [
		'f1.png', 'f2.png',
		'f4.png', 'f3.png',
		'f5.png', 'f6.jpg'
	]
	var fMaterial = [
		new THREE.MeshStandardMaterial({	map: loader.load(cubeF[0])}),
		new THREE.MeshStandardMaterial({	map: loader.load(cubeF[1])}),
		new THREE.MeshStandardMaterial({	map: loader.load(cubeF[2])}),
		new THREE.MeshStandardMaterial({	map: loader.load(cubeF[3])}),
		new THREE.MeshStandardMaterial({	map: loader.load(cubeF[4])}),
		new THREE.MeshStandardMaterial({	map: loader.load(cubeF[5])})
	];
	//create the triangular polygon mesh and add it the scene
	cube = new THREE.Mesh( geometry, fMaterial );
	scene.add( cube );

	
	// load the 3D object in to the scene
	var _3dLoader = new THREE.OBJLoader();
	const scale = .4;
	_3dLoader.load("model/bunny-5000.obj",
	// called when resource is loaded
	function(object){

		object.traverse(function(child){
			if (child instanceof THREE.Mesh ){
				_3dObj = child;
			}
		} );
		// re-center the loaded object 
		_3dObj.geometry.center();		
		// edge mapping on the 3D object 
		_3dWireframe = new THREE.Mesh( _3dObj.geometry, eMaterial)
		// vertecies of 3D object
		var pMaterial3D = new THREE.PointsMaterial( { size: 0.01, color: 0xffff00});
		_3dPoints = new THREE.Points( _3dObj.geometry, pMaterial3D )
		// scale to fit the cube with abituary uniform scale 
		_3dObj.scale.set(scale, scale, scale);
		_3dWireframe.scale.set(scale, scale, scale);
		_3dPoints.scale.set(scale, scale, scale);
		_3dObj.material.flatShading = true;
		// adds the model to the scene
		scene.add( _3dObj );
	},
	// called when loading is in progresses
	function ( xhr ) {

		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

	},
	// called when loading has errors
	function ( error ) {

		console.log( 'An error happened' );

	}
	);


	// TO DO: Visualise the axes of the global coordinate system (requirment 2).
	axisHelper = new THREE.AxesHelper( 4);
	scene.add( axisHelper );

	// Basic ambient lighting.
	ambient = new THREE.AmbientLight(0xffffff, .7)
	scene.add(ambient);

	// TO DO: add more complex lighting for 'face' rendering mode (requirement 4).
	directionalLight = new THREE.DirectionalLight(0xffffff);
	directionalLight.position.copy(camera.position);
	lightHelper = new THREE.DirectionalLightHelper( directionalLight);
	directionalLight.add( lightHelper );
	scene.add( directionalLight );

	// Set up the Web GL renderer.
	renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setPixelRatio(window.devicePixelRatio); // HiDPI/retina rendering
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);
	
	// Handle resizing of the browser window. 
	// i fixed the window resize feature as it was not working the way i wanted
	// document.addEventListener('resize', handleResize); // old code 
	addEventListener('resize', handleResize); // new code

}

// Handle resizing of the browser window.
function handleResize()
{
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}

// Animation loop function. This function is called whenever an update is required.
function animate()
{
	requestAnimationFrame(animate);
	// update the camera position.
	updateCam();
	// Render the current scene to the screen.
	renderer.render(scene, camera);
	
}

function camRot() {

	if (orbiting){
		var rotSpeed = 0.005;
		requestAnimationFrame(camRot);
	  	var x = camera.position.x;
		var z = camera.position.z;
		var y = camera.position.y;
		camera.position.x = x * Math.cos(rotSpeed) + z * Math.sin(rotSpeed);
		camera.position.y = y * Math.cos(rotSpeed) + z * Math.sin(rotSpeed);
		camera.position.z = z * Math.cos(rotSpeed) - y * Math.sin(rotSpeed);
		directionalLight.position.copy(camera.getWorldPosition(new THREE.Vector3()));
		
		camera.lookAt(scene.position);
		directionalLight.lookAt(scene.position);
		directionalLight.remove(lightHelper);	
	}
 

    renderer.render(scene, camera);
  }

function animateRotation() {
	if (rotating){
		requestAnimationFrame(animateRotation);
		const rSpeed = 0.02;
		const quant = new THREE.Quaternion();
		var vector;
		if (axes == 'x' ) 
			vector = new THREE.Vector3(1, 0, 0);
		if (axes == 'y' ) 
			vector = new THREE.Vector3(0, 1, 0);
		if (axes == 'z' ) 
			vector = new THREE.Vector3(0, 0, 1);
		if (axes == null)
			vector = new THREE.Vector3(0, 0, 0);
		// rotates the object about the vector given
		quant.setFromAxisAngle( vector, rSpeed);
		cube.applyQuaternion(quant), wireframe.applyQuaternion(quant), points.applyQuaternion(quant) ;
		_3dObj.applyQuaternion(quant), _3dPoints.applyQuaternion(quant), _3dWireframe.applyQuaternion(quant);
	}
	renderer.render(scene, camera);
}



// Handle keyboard presses.
function handleKeyDown(event)
{

	switch (event.keyCode)
	{
		// // Render modes.
		case 70: // f = face
			// alert('TO DO: add code for face render mode (requirement 4).');
			scene.add(cube);
			scene.remove( wireframe );
			scene.remove(points);
			break;

		case 69: // e = edge
		// 	alert('TO DO: add code for edge render mode (requirement 4).1');
			scene.add( wireframe );
			scene.remove(points);
			scene.remove(cube);
			break;

		case 86: // v = vertex
			// alert('TO DO: add code for vertex render mode (requirement 4).');
			scene.add(points);
			scene.remove( wireframe );
			scene.remove(cube);

			break;

		// 3d obj Render mode
		case 73: // i  face
			scene.add(_3dObj);
			scene.remove( _3dWireframe );
			scene.remove(_3dPoints);
			break;
		case 79: // o wireframe
			scene.add( _3dWireframe );
			scene.remove(_3dPoints);
			scene.remove(_3dObj);
			break;
		case 80: // p 
			scene.add(_3dPoints);
			scene.remove(_3dObj);
			scene.remove( _3dWireframe );
			break;		

		// TO DO: add code for starting/stopping rotations (requirement 3).
		case 88: // x key
			if (rotating && axes == 'x') {rotating = false; break;}
			axes = 'x';
			if (!rotating) {rotating = true, animateRotation();}

			break;
		case 90: // z key
			if (rotating && axes == 'z') {rotating = false; break;}
			axes = 'z';
			if (!rotating) {rotating = true, animateRotation();}						
			break;
		case 89: // y key
			if (rotating && axes == 'y') {rotating = false; break;}
			axes = 'y';
			if (!rotating) {rotating = true, animateRotation(); }		
			break;
		case 82: // r  = reset
			if (!cool){
				cube.rotation.set(0, 0, 0);
				points.rotation.set(0,0,0);
				wireframe.rotation.set(0,0,0);
				_3dObj.rotation.set(0,0,0);
				_3dWireframe.rotation.set(0,0,0);
				_3dPoints.rotation.set(0,0,0);
				// sets axes state to null
				axes = null;

				// reset the camera lookAt
				camera.lookAt(0,0,0);
				target.set(0,0,0);
				camera.updateProjectionMatrix();
				camera.position.set(3,4,5);
			}

			break;
		case 37: //< pan left
			var v = new THREE.Vector3();
			v.setFromMatrixColumn( camera.matrix, 0 ); // get the x column
			v.multiplyScalar(-.5);
			panOffset.add(v);
			break;
		case 38: // ^ pan up
			var v = new THREE.Vector3();
			v.setFromMatrixColumn( camera.matrix, 1 ); // get the y column
			v.multiplyScalar(.5);
			panOffset.add(v);
			break;
		case 39: // > pan right
			var v = new THREE.Vector3();
			v.setFromMatrixColumn( camera.matrix, 0 ); // get the x column
			v.multiplyScalar(.5);
			panOffset.add(v);
			break;
		case 40: // down arrow  pan down
			var v = new THREE.Vector3();
			v.setFromMatrixColumn( camera.matrix, 1 ); // get the y column
			v.multiplyScalar(-.5);
			panOffset.add(v);
			break;
		case 187: // + dolly in
			camera.translateZ(-1);
			break;
		case 189 : // - dolly out
			camera.translateZ(+1);
			break;
		case  71: // g to add and remove the grid
			if (grid.parent === scene){
				scene.remove(grid);
			}else { scene.add( grid );}
			break;
		case 81 : // q rotate camera about the scene
			if (!orbiting){
				orbiting = true;
				camRot();	
			}else {orbiting = false;}
			break;
		case 72: // h head view
			if (cool){
				camera.position.set(0, 0, 11);
				target.set(0,0,0);
			}
			
			break;
		case 77: // m mincraft view
			if (cool){
				camera.position.set(size+size/2,
					0, 11);
				target.set(size+size/2,0,0);
			}
			break;
		case 32: // spacebar = something creative
			if(!cool){
				cool = true;
				// remove all children fromthe scene
				scene.clear()
				// calls the something cool function
				artSpace();
				
			}else{
				// uses to start and pause the objects orbit around the head
				if(!paused){
					paused = true;
				}else{
					paused = false;
				}

			}
	}

}



function artSpace() {

	// configure renderer
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;
	renderer.outputEncoding = THREE.sRGBEncoding;
	
	// camera new position
	scene.add(camera);
	camera.position.set(0, 10, 50);
	camera.lookAt(scene.position);

// load head objects 
	// load the 3D object in to the scene
	var _3dLoader = new THREE.OBJLoader();
	_3dLoader.load("model/head.obj",
	// called when resource is loaded
	function(object){

		object.traverse(function(child){
			if (child instanceof THREE.Mesh ){
				head = child;
				head.material = new THREE.MeshStandardMaterial( {
					 color: 0xffffff, wireframe: true, metalness: .25, });
			}
		} );
		head.scale.set(10,10,10);
		head.geometry.center();		
		head.castShadow = true;
		head.receiveShadow = true;
		// adds the model to the scene
		scene.add( head);	
	}
	);
	

// create other objects

	// create box rooms (background)
	const geometry = new THREE.BoxBufferGeometry( size, size, size );

	const material = new THREE.MeshStandardMaterial( {
		color: 0x808080,
		side: THREE.BackSide
	} );
	material.roughness = 0;
	material.metalness = 0.25;
	backGround = new THREE.Mesh( geometry, material );
	backGround.receiveShadow = true;


	var loader = new THREE.TextureLoader();
	var skyMaterial = new THREE.MeshStandardMaterial({
		map : loader.load("texture/daySkyTexture.jpg"),
		side: THREE.BackSide
	});
	// second background cube for minecraft 
	backGround1 = new THREE.Mesh( geometry, skyMaterial );
	backGround1.position.set( size + size/2, 0 ,0 );

	// third background cube for light probe
	const backGround2 = new THREE.Mesh( geometry, material );
	backGround2.position.set( -size - size/2, 0 ,0 );
	
// add shadows to already defined obj
	cube.scale.set(.4,.4,.4);
	cube.castShadow = true;
	cube.receiveShadow = true;
	cube.material.roughness = 0.1;
	cube.material.metalness = 0.25;

	_3dObj.scale.set(.2,.2,.2);
	_3dObj.castShadow = true;
	_3dObj.receiveShadow = true;
	_3dObj.material.roughness = 0.1;
	_3dObj.material.metalness = 0.25;

	// add objects to scene
	scene.add(_3dObj);
	scene.add(cube);
	scene.add( backGround );
	scene.add( backGround1 );
	// scene.add( backGround2);


// lights
	//SpotLight( color : Integer, intensity : Float, distance : Float, angle : Radians, penumbra : Float, decay : Float )
	 spotLight = new THREE.SpotLight( { color: 0xffffff, intensity: .4});
	 spotLight.angle = Math.PI / 5;
	 spotLight.penumbra = 0.1;
	 spotLight.decay = 2;
	 spotLight.distance = 200;

	 spotLight.castShadow = true;
	 spotLight.shadow.mapSize.width = 512;
	 spotLight.shadow.mapSize.height = 512;
	 spotLight.shadow.camera.near = 10;
	 spotLight.shadow.camera.far = 200;
	 spotLight.shadow.focus = 1;
	 spotLight.position.set(0, size-1, 0 );

	// hemsph light
	hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.5 );
	hemiLight.color.setHSL( 0.6, 1, .6 );
	hemiLight.groundColor.setHSL( 0.25, 0.9 , 0.65 );
	hemiLight.position.set( 0, 19, 0 );

	// light probe
	// lightProbe = new THREE.LightProbe();

	// point light
	var bulbGeometry = new THREE.SphereBufferGeometry( 0.02, 16, 8 )
	pointLight = new THREE.PointLight( 0xffffff, .5, 19 );
	var bulbMat = new THREE.MeshStandardMaterial( {
		emissive: 0xffffee,
		emissiveIntensity: 1,
		color: 0x000000
	} );
	pointLight.add( new THREE.Mesh( bulbGeometry, bulbMat ) );
	pointLight.castShadow = true;
	pointLight2 = new THREE.PointLight( 0xffff00, .1, 19 );
	pointLight2.add( new THREE.Mesh( bulbGeometry, bulbMat ) );
	pointLight2.position.set( 0, 0, 0 );
	pointLight2.castShadow = true;

	// add lights to the scene
	scene.add( hemiLight );	
	scene.add(spotLight);
	scene.add(pointLight);
	scene.add(pointLight2)
	// scene.add( lightProbe );


// minecraft view

	// seed the noise random nunmber generator
	noise.seed(Math.random());
	var blocks = [];
	var xoff = 0;
	var zoff = 0;
	var inc = .1;
	var height = 5; 
	for (var x = size +1; x < size*2 - .5; x++){
		xoff = 0;
		for (var z = -size/2 + 1; z < size/2 - .5 ; z++){
			var v = Math.round(noise.perlin2(xoff,zoff) * height);
			blocks.push(new block(x, v + (size*-1)/2 + height , z));
			xoff += inc;
		}
		zoff = zoff + inc;
	}

	for(var i = 0; i < blocks.length; i++){
		blocks[i].display();
	}


	function animation(t){
	if (!paused) {
		// maths delineating objects orbit about the head 
		cube.position.x = Math.cos(t/720)*2.5 ;
		cube.position.z = Math.sin(t/720)*2.5;
		_3dObj.position.x = Math.cos(t/720 + 3)*2.5;
		_3dObj.position.z = Math.sin(t/720 + 3)*2.5;
		pointLight.position.x = Math.cos(t/720 - 1.5)*2.5;
		pointLight.position.z = Math.sin(t/720 - 1.5)*2.5;
		pointLight2.position.x = Math.cos(t/720 + 1.5)*2.5;
		pointLight2.position.z = Math.sin(t/720 + 1.5)*2.5;
		oscillateAndRotate(t, _3dObj);
		oscillateAndRotate(t, cube);
		oscillateAndRotate(t, pointLight);
		oscillateAndRotate(t, pointLight2);

		cube.rotation.x = t/500;
		cube.rotation.y = t/800;
		renderer.clear();
		renderer.render(scene, camera);
		}
	window.requestAnimationFrame(animation, renderer.domElement);
	};

	function oscillateAndRotate(t, obj) {
		// object oscilate along the y-axis
		obj.position.y = 2-Math.sin(t/900);
		// object rotate about it's x and y axis 
		obj.rotation.x = t/500;
		obj.rotation.y = t/800;
	} 
	animation(new Date().getTime());
	

}


// ==== requirement 6 acr ball mode =====
function updateCam() {

	var offset = new THREE.Vector3();

	var position  = camera.position;
	offset.copy(position).sub(target);

	spherical.setFromVector3( offset );

	spherical.theta += sphericalDelta.theta;
	spherical.phi += sphericalDelta.phi;

	// restrict theta to be between desired limits
	spherical.theta = Math.max( -Infinity, Math.min( Infinity, spherical.theta ) );

	// restrict phi to be between desired limits
	spherical.phi = Math.max( 0, Math.min( Math.PI, spherical.phi ) );

	spherical.makeSafe();

	// move target to panned location
	target.add( panOffset );

	offset.setFromSpherical( spherical );

	position.copy( target ).add( offset );

	camera.lookAt( target );
	
	sphericalDelta.set( 0, 0, 0 );

	panOffset.set( 0, 0, 0 );


}

function onMouseDown(event){

	down = true; start.set(event.clientX, event.clientY);
}
function onMouseUp(event){

	down = false;
}
function onMouseMove(event){

	if (down) {

		end.set(event.clientX, event.clientY);
		delta.subVectors(end, start);


		// rotating across whole screen goes 360 degrees around
		rotateLeft(2 * Math.PI * delta.x /renderer.domElement.width );
				
		// rotating up and down along whole screen attempts to go 360, but limited to 180
		rotateUp( 2 * Math.PI * delta.y / renderer.domElement.height );

		start.copy( end );

		}
	
}

function block(x , y , z){

	this.x = x;
	this.y = y;
	this.z = z;
	// creates and add block to the scene 
	this.display = function(){
		var blockBox = new THREE.BoxGeometry(1,1, 1)
		var loader = new THREE.TextureLoader();
		var materialArray = [
			new THREE.MeshBasicMaterial({map : loader.load("texture/side4.jpg")}),
			new THREE.MeshBasicMaterial({map : loader.load("texture/side1.jpg")}),
			new THREE.MeshBasicMaterial({map : loader.load("texture/top.jpg")}),
			new THREE.MeshBasicMaterial({map : loader.load("texture/bottom.jpg")}),
			new THREE.MeshBasicMaterial({map : loader.load("texture/side2.jpg")}),
			new THREE.MeshBasicMaterial({map : loader.load("texture/side3.jpg")}),
		];
		var block = new THREE.Mesh( blockBox, materialArray);
		scene.add(block);
		block.position.set(this.x, this.y , this.z);

		// create outline for each block using edge view
		var edges = new THREE.EdgesGeometry(blockBox);
		var line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({color : 0xffffff}));
		scene.add(line);
		line.position.set(this.x, this.y , this.z);

	}
}

function rotateLeft( angle ) {

	sphericalDelta.theta -= angle;
}

function rotateUp( angle ) {

	sphericalDelta.phi -= angle;
}
