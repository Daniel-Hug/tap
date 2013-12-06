// Define starting variables and helper functions:
var isTouchDevice =
	('ontouchstart' in window) ||
	!!(window.DocumentTouch && document instanceof DocumentTouch);
var tapEvent = isTouchDevice ? 'touchstart' : 'mousedown';
var tapReleaseEvent = isTouchDevice ? 'touchend' : 'mouseup';
var wasFirstTapReleased, record, last;

// addEventListener wrapper:
function on(target, type, callback) {
	target.addEventListener(type, callback, false);
}

// Update record output:
var output = document.querySelector('output');
function setRecord(now) {
	record = now - last;
	output.textContent = record + 'ms';
	if (!isTouchDevice) output.title = 'milliseconds between your quickest taps';
}

// Ensure a tap release occured between taps:
function tapRelease() {
	wasFirstTapReleased = true;
}


// Reset record:
var resetBtn = document.querySelector('button');
function reset() {
	record = last = 0;
	output.textContent = '';
	if (!isTouchDevice) output.title = 'Tap away!';
	wasFirstTapReleased = false;
}
reset();
on(resetBtn, 'click', reset);


// Listen for tap event:
on(window, tapEvent, function tap(event) {
	if (event.target === resetBtn) return;
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
});


// prevent default touch swipe action:
on(document.body, 'touchmove', function(event) {
	event.preventDefault();
});


// Listen for app updates:
var appCache = window.applicationCache
on(appCache, 'updateready', function(e) {
	if (appCache.status == appCache.UPDATEREADY) {
		appCache.swapCache();
		if (confirm('A new version of this webapp has been loaded. Update now?')) {
			window.location.reload();
		}
	}
});