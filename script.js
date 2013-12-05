var record = 0;
var last = 0;
var output = document.querySelector('output');
var button = document.querySelector('button');
var isTouchDevice =
	('ontouchstart' in window) ||
	!!(window.DocumentTouch && document instanceof DocumentTouch);
var tapEvent = isTouchDevice ? 'touchstart' : 'mousedown';
var tapReleaseEvent = isTouchDevice ? 'touchend' : 'mouseup';
var wasFirstTapReleased;

function setRecord(now) {
	record = now - last;
	output.textContent = record;
}

function tapRelease() {
	wasFirstTapReleased = true;
}

function tap(event) {
	if (event.target === button) return;
	event.preventDefault();
	if (!isTouchDevice && event.button !== 0) return;
	var now = Date.now();
	if (record) {
		if (now - last < record && wasFirstTapReleased) setRecord(now);
	} else {
		if (last && wasFirstTapReleased) setRecord(now);
	}
	last = now;
	wasFirstTapReleased = false;
	window.addEventListener(tapReleaseEvent, tapRelease, false);
}

function reset() {
	record = last = 0;
	output.textContent = '';
	wasFirstTapReleased = false;
}

function preventDefault(event) {
	event.preventDefault();
}

button.addEventListener('click', reset, false);
window.addEventListener(tapEvent, tap, false);
document.body.addEventListener('touchmove', preventDefault, false);