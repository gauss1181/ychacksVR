// main.js
'use strict';


//firebase
var firepadDiv, firepadRef, codeMirror, firepad;

var container;

window.onload = load;

function load() {
	init();
}

function init() {
	setupFire();
}

//setup firebase/firepad stuff
function setupFire() {
	firepadDiv = document.getElementById('firepad');
	firepadRef = new Firebase('https://blazing-fire-6125.firebaseio.com/'); 
	codeMirror = CodeMirror(firepadDiv, {
		lineWrapping: true,
		lineNumbers: true,
		mode: 'javascript',
		theme: 'monokai' });
	firepad = Firepad.fromCodeMirror(firepadRef, codeMirror,
			{ richTextShortcuts: true, richTextToolbar: true });

	firepad.on('ready', function() { firepad.setText('x'); });
}

