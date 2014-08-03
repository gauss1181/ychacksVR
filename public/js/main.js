// main.js
'use strict';

var clock = new THREE.Clock();
var time = Date.now();

//firebase
var firepadDiv, firepadRef, codeMirror, firepad;

var container;
var w, h;

window.onload = load;

function load() {
	init();
	render();
}

function init() {

	setupFire();
	setupRendering();
	setupScene();
	setupControls();
}

//setup firebase/firepad stuff
function setupFire() {
	firepadDiv = document.getElementById('firepad');
	firepadRef = new Firebase('https://blazing-fire-6125.firebaseio.com/'); // insert firebase url here
	codeMirror = CodeMirror(firepadDiv, {
		lineNumbers: true,
		mode: 'javascript',
		theme: 'monokai' });
	firepad = Firepad.fromCodeMirror(firepadRef, codeMirror,
			{  });

	firepad.on('ready', function() { firepad.setText('x'); });
	//// Initialize contents.
	//firepad.on('ready', function() {
		//if (firepad.isHistoryEmpty()) {
	//		firepad.setText('// JavaScript Editing with Firepad!\nfunction go() {\n var message = "Hello, world.";\n console.log(message);\n}');
		//}
	//});
}

function setupRendering() {

}

function setupScene() {

}

function setupControls() {

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
}

function render(dt) {

}
