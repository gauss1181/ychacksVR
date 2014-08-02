// main.js
'use strict';

var clock = new THREE.Clock();
var time = Date.now();

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

