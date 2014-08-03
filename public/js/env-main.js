'use strict';

var camera, scene, renderer;

var time = Date.now(), clock = new THREE.Clock();

var fullScreenButton;

var geometry, material, mesh;

var effect;
var controls;

var vrEffect;
var vrControls;

var objects = [];

var maxAnisotropy;

var updateFns = [];

var has = {
	WebVR: !!navigator.mozGetVRDevices || !!navigator.getVRDevices
};


window.addEventListener('load', load);

function load() {
	init();
	animate();
}


function init() {
	camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 20000);

	camera.position.set(0,0,0);

	scene = new THREE.Scene();
	scene.fog = new THREE.Fog(0xffffff, 0, 1500);

	fullScreenButton = document.querySelector('.button');

	controls = new THREE.OculusRiftControls(camera);
	scene.add(controls.getObject());

	setupScene();
	setupLights();

	setupAudio();
	
	setupVideo();

	setupRendering();

	setupSkymap();

	setupEvents();
}

function setupLights() {
	var light = new THREE.DirectionalLight(0xffffff, 1.5);
	light.position.set(1, 1, 1);
	scene.add(light);

	light = new THREE.DirectionalLight(0xffffff, 0.75);
	light.position.set(-1, -0.5, -1);
	scene.add(light);

	light = new THREE.AmbientLight(0x666666);
	scene.add(light);
}

function setupScene() {
	// floor
	var geometry = new THREE.PlaneGeometry(2000, 2000, 1, 1);
	geometry.applyMatrix( new THREE.Matrix4().makeRotationX( - Math.PI / 2 ) );

	var texture = THREE.ImageUtils.loadTexture('img/gnd.jpg');
	texture.wrapS = THREE.RepeatWrapping;
	texture.wrapT = THREE.RepeatWrapping;

	texture.repeat = new THREE.Vector2(10, 10);

	var material = new THREE.MeshBasicMaterial( { color: 0xcccccc, map: texture,
		transparent: 0, opacity: 0.6 } );

	var mesh = new THREE.Mesh(geometry, material);

	mesh.position.y = -10;

	mesh.receiveShadow = true;

	scene.add(mesh);


	setupTeams();

	setupPhotos();

	return;

	// cubes
	geometry = new THREE.BoxGeometry(30, 30, 30);

	for (var i = 0; i < 200; i ++) {

		var object = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff } ) );

		object.material.ambient = object.material.color;

		object.position.x = Math.random() * 1000 - 500;
		object.position.y = Math.random() * 600 - 300;
		object.position.z = Math.random() * 800 - 400;

		object.rotation.x = Math.random() * 2 * Math.PI;
		object.rotation.y = Math.random() * 2 * Math.PI;
		object.rotation.z = Math.random() * 2 * Math.PI;

		scene.add(object);

		objects.push(object);
	}
}

function setupTeams() {

	var teams = [
		'awesome','hacky','hellll yeah!', 'fuck it ship it',
		'cpp','js-ftw','fasf','xvlkjdslfks'];

	for (var r = 0; r < 1; r++) {
		for (var i = 0; i < teams.length; i++) {

			var container = setupScreens(3);

			container.position.z = -50 * i;

			container.position.x = r * 100 - 250;
			// todo: put containers in random spots

			scene.add(container);
		}
	}

}

function setupVideo() {

	var webcamTexture	= new THREEx.WebcamTexture();

	updateFns.push(function(delta, now){
		webcamTexture.update(delta, now);
	});

	var geometry	= new THREE.BoxGeometry(100,80,100);
	var material	= new THREE.MeshBasicMaterial({
		map	: webcamTexture.texture
	});
	var mesh	= new THREE.Mesh( geometry, material );	

	mesh.rotation.x = 0.5;

	mesh.position.y = 110;
	mesh.position.z = -400;

	scene.add(mesh);
}

function setupSkymap() {
	var mesh	= THREEx.createSkymap('yc');

	mesh.scale.set(5,5,5);

	console.log(mesh);
	scene.add( mesh );
	console.log('skymap added');
}

function setupScreens(n) {

	var cont = new THREE.Object3D();

	var col = Math.random() * 0xffffff;

	function randi(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	for (var i = 0; i < n; i++) {
		var path = 'img/img-screenshots/sc-'+randi(1,16)+'.jpg';
		var texture = THREE.ImageUtils.loadTexture(path);
		texture.anisotropy = maxAnisotropy;
		texture.minFilter = texture.magFilter = THREE.LinearMipMapLinearFilter;

		var con = new THREE.Object3D();

		var geometry = new THREE.BoxGeometry(1024+30, 560+30, 10);


		var material = new THREE.MeshBasicMaterial( {
			color: col } );

		var mesh = new THREE.Mesh(geometry, material);

		mesh.position.z = -15;

		var geo = new THREE.PlaneGeometry(1024, 560);
		var mat = new THREE.MeshBasicMaterial({
			map: texture
		});

		var _mesh = new THREE.Mesh(geo, mat);

		con.add(_mesh);

		//con.add(mesh);

		var object = con;

		object.position.x = (i - 0.5*(n-1)) * 17;
		object.position.y = 9;
		object.position.z = -15 + (Math.abs((i - 0.5*(n-1))) * 3.2);

		object.rotation.y = (i - 0.5*(n-1)) * -0.4;

		object.scale.set(0.016, 0.016, 0.016);

		cont.add(object);

		objects.push(object);
	}

	return cont;
}

function setupPhotos() {
	// todo: load photos for a photo wall?
}

function setupAudio() {
	// create WebAudio API context
	var context = new AudioContext()

	// Create lineOut
	var lineOut = new WebAudiox.LineOut(context)

	// load a sound and play it immediately
	WebAudiox.loadBuffer(context, 'audio/audio-bkg-remix.mp3', function(buffer){
		// init AudioBufferSourceNode
		var source  = context.createBufferSource();
		source.buffer = buffer
		source.connect(lineOut.destination)

		source.loop = true;

		// start the sound now
		source.start(0);
	});	
}

function setupRendering() {
	renderer = new THREE.WebGLRenderer({
		antialias: 1
	});
	renderer.setClearColor(0xffffff, 1);

	maxAnisotropy = renderer.getMaxAnisotropy();

	var DK1 = [1280, 800];
	var DK2 = [1920, 1080];

	var HMD = DK2;

	function VREffectLoaded(error) {
		if (error) {
			fullScreenButton.innerHTML = error;
			fullScreenButton.classList.add('error');
		}
	}

	renderer.setSize(window.innerWidth, window.innerHeight);
	vrEffect = new THREE.VREffect(renderer, VREffectLoaded);
	vrControls = new THREE.VRControls(camera);

	var container = document.createElement('div');
	document.body.insertBefore(container, document.body.firstChild);
	container.appendChild(renderer.domElement);
}

function setupEvents() {
	window.addEventListener('resize', onWindowResize, false);
	document.addEventListener('keydown', keyPressed, false);

	fullScreenButton.addEventListener('click', function(){
		vrEffect.setFullScreen(true);
	}, true);
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize(window.innerWidth, window.innerHeight);
}

function keyPressed (e) {
	if (e.keyCode == 'R'.charCodeAt(0)) {
		//vrControls._vrInput.resetSensor();
	}
}

var lastTimeMsec= null;

function animate(nowMsec) {
	requestAnimationFrame(animate);

	lastTimeMsec	= lastTimeMsec || nowMsec-1000/60;
	var deltaMsec	= Math.min(200, nowMsec - lastTimeMsec);
	lastTimeMsec	= nowMsec;

	updateFns.forEach(function(updateFn){
		updateFn(deltaMsec/1000, nowMsec/1000)
	});

	var vrState = vrControls.getVRState();

	camera.position.copy(controls.getObject().position);
	controls.update(Date.now() - time, vrState);

	vrControls.update();
	vrEffect.render(scene, camera);

	time = Date.now();
}

