// main.js
'use strict';

var clock = new THREE.Clock();
var time = Date.now();

var renderer, renderer2;
var scene, scene2;
var head, head2;
var camera, camera2;
var controls, controls2;

//firebase
var firepadDiv, firepadRef, codeMirror, firepad;

var container;
var w, h;

window.onload = load;

function load() {
	init();
	animate();
}

function init() {
	w = window.innerWidth, h = window.innerHeight;

	var IPD = 150;

	camera = new THREE.PerspectiveCamera(75, 640 / 800, 1, 10000);
	camera.position.x = -IPD;

	camera2 = new THREE.PerspectiveCamera(75, 640 / 800, 1, 10000);
	camera2.position.x = IPD;

	//setupFire();
	setupRendering();
	setupScene();
	setupControls();
	setupEvents();
}

//setup firebase/firepad stuff
function setupFire() {
	firepadDiv = document.getElementById('firepad');
	firepadRef = new Firebase('https://blazing-fire-6125.firebaseio.com/'); 
	codeMirror = CodeMirror(firepadDiv, {
		lineWrapping: true,
		lineNumbers: true,
		mode: 'javascript',
		theme: 'monokai'
	});
	firepad = Firepad.fromCodeMirror(firepadRef, codeMirror,
			{ richTextShortcuts: true, richTextToolbar: true });

	firepad.on('ready', function() { firepad.setText('x'); });
}

function setupRendering() {
	renderer = new THREE.CSS3DRenderer();
	renderer.setSize( w/2, h );
	renderer.domElement.style.position = 'absolute';
	renderer.domElement.style.top = 0;
	document.getElementById('viewbox0').appendChild(renderer.domElement);


	renderer2 = new THREE.CSS3DRenderer();
	renderer2.setSize( w/2, h );
	renderer2.domElement.style.position = 'absolute';
	renderer2.domElement.style.top = 0;
	document.getElementById('viewbox1').appendChild(renderer2.domElement);
}

function setupScene() {
	scene = new THREE.Scene();
	scene2 = new THREE.Scene();


	var screens = [{
		url: 'firepad.html',//'http://ycombinator.com',
		position: [0, 0, -1100],
		rotation: [0, 0, 0],
		size: 1,
		aspect: 13/9
	}];

	var screen;

	for (var i = 0; i < screens.length; i++) {
		screen = screens[i];

		var win = document.createElement('div');

		var element = document.createElement('iframe');
		element.setAttribute('src', screen.url);
		//element.setAttribute('seamless', true);
		element.style.width = Math.round(900*screen.aspect)+'px';
		element.style.height = 900+'px';
		var color = new THREE.Color( Math.random() * 0xffffff ).getStyle();
		element.style.background = color;

		var navBar = document.createElement('input');
		navBar.setAttribute('type', 'text');
		navBar.className = 'nav-bar';
		navBar.value = screen.url;

		win.appendChild(navBar);
		win.appendChild(element);

		var object = new THREE.CSS3DObject(win);
		object.position.fromArray(screen.position);
		object.rotation.fromArray(screen.rotation);
		scene.add(object);


		var win2 = win.cloneNode(true);
		var element2 = win2.getElementsByTagName('iframe')[0];
		var navBar2 = win2.getElementsByTagName('input')[0];


		var object2 = new THREE.CSS3DObject(win2);
		object2.position.copy(object.position);
		object2.rotation.copy(object.rotation);
		object2.scale.copy(object.scale);
		scene2.add(object2);


		$(navBar).click(function(e){
			$(this).select();
			$(navBar2).val('');
		});

		$(navBar).keypress(function(e){
			if (e.which == 13) { // enter
				var url = navBar.value;

				if (!/^https?:\/\//i.test(url)) {
					url = 'http://' + url;
				}
				navBar.value = url;
				navBar2.value = url;

				element.setAttribute('src', url);
				element2.setAttribute('src', url);
			}
		});
	}

	var elements = [
		{
			position: [0, 800, -950],
			rotation: [0.4, 0, 0],
			scale: [3,3,3],
			src: '../img-logo/logo-v2.png',
			size: [232,178]
		}/*,
		{
			position: [0, -1000, 0],
			rotation: [1, 0, 0],
			scale: [10,10,10],
			src: 'img/checker.png',
			size: [512,512]
		}*/
	];

	for (var i = 0; i < elements.length; i++) {
		var el = elements[i];
		var elSize = el.size;

		var div = document.createElement('div');
		div.className = 'img';
		div.style.width = elSize[0]+'px';
		div.style.height = elSize[1]+'px';
		//div.style.backgroundColor = 'red';
		div.style.backgroundImage = 'url('+el.src+')';

		//var img = document.createElement('img');
		//img.setAttribute('src', el.src);

		//var color = new THREE.Color( Math.random() * 0xffffff ).getStyle();
		//element.style.background = color;

		//div.appendChild(img);

		var object = new THREE.CSS3DObject(div);
		object.position.fromArray(el.position);
		object.rotation.fromArray(el.rotation);
		object.scale.fromArray(el.scale);
		scene.add(object);

		var div2 = div.cloneNode(true);

		var object2 = new THREE.CSS3DObject(div2);
		object2.position.fromArray(el.position);
		object2.rotation.fromArray(el.rotation);
		object2.scale.fromArray(el.scale);
		scene2.add(object2);
	}

}

function setupControls() {
	controls = new THREE.VRControls(camera);
	controls2 = new THREE.VRControls(camera2);
}

function setupEvents() {
	window.addEventListener('resize', resize, false);
}

function resize() {
	w = window.innerWidth, h = window.innerHeight;

	renderer.setSize(w/2, h);
	renderer2.setSize(w/2, h);
}

function animate(t) {
	requestAnimationFrame(animate);

	var dt = clock.getDelta();

	update(t);
	render(t);

	time = Date.now();
}

function update(dt) {
	TWEEN.update(dt);

	controls.update();
	controls2.update();
}

function render(dt) {
	renderer.render(scene, camera);
	renderer2.render(scene2, camera2);	
}
