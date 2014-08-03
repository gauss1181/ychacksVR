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


var has = {
	WebVR: !!navigator.mozGetVRDevices || !!navigator.getVRDevices
};


window.addEventListener('load', load);

function load() {
	init();
	animate();
}


function init() {
	camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 3000);

	camera.position.set(0,0,0);

	scene = new THREE.Scene();
	scene.fog = new THREE.Fog(0xffffff, 0, 1500);

	fullScreenButton = document.querySelector('.button');

	controls = new THREE.OculusRiftControls(camera);
	scene.add(controls.getObject());

	setupScene();
	setupLights();

	setupAudio();
	
	setupRendering();

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

	var texture = THREE.ImageUtils.loadTexture('img/checker.png');
	texture.wrapS = THREE.RepeatWrapping;
	texture.wrapT = THREE.RepeatWrapping;

	texture.repeat = new THREE.Vector2(20, 20);

	var material = new THREE.MeshBasicMaterial( { color: 0xcccccc, map: texture, transparent: true, opacity: 0.6 } );

	var mesh = new THREE.Mesh(geometry, material);
	mesh.receiveShadow = true;

	scene.add(mesh);


	setupTeams(4);

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

	var teams = ['awesome','hacky','hellll yeah!', 'fuck it ship it'];

	for (var i = 0; i < teams.length; i++) {

		var container = setupScreens(3);

		container.position.z = -30 * i;
		// todo: put containers in random spots

		scene.add(container);
	}

}

function setupScreens(n) {

	var cont = new THREE.Object3D();

	var col = Math.random() * 0xffffff;

	var paths = ['img/checker.png'];

	for (var i = 0; i < n; i++) {
		var path = paths[0];
		var texture = THREE.ImageUtils.loadTexture(path);

		var geometry = new THREE.BoxGeometry(15, 11, 0.5);


		var material = new THREE.MeshBasicMaterial( {
			color: col,
			map: texture } );

		var mesh = new THREE.Mesh(geometry, material);

		var object = mesh;

		object.position.x = (i - 0.5*(n-1)) * 17;
		object.position.y = 9;
		object.position.z = -15 + (Math.abs((i - 0.5*(n-1))) * 2.5);

		object.rotation.y = (i - 0.5*(n-1)) * -0.4;

		cont.add(mesh);

		objects.push(object);
	}

	return cont;
}

function setupPhotos() {

}

function setupAudio() {
	
}

function setupRendering() {
	renderer = new THREE.WebGLRenderer({
		antialias: false,
	});
	renderer.setClearColor(0xffffff, 1);

	var DK1 = [1280, 800];
	var DK2 = [1920, 1080];

	var HMD = DK1;

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

function animate(t) {
	requestAnimationFrame(animate);

	var vrState = vrControls.getVRState();

	camera.position.copy(controls.getObject().position);
	controls.update(Date.now() - time, vrState);

	vrControls.update();
	vrEffect.render(scene, camera);

	time = Date.now();
}

