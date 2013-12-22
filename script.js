var isTouchDevice =
	('ontouchstart' in window) ||
	!!(window.DocumentTouch && document instanceof DocumentTouch);
var prevTapWasReleased, record, last, highest, taps;

function arrMax(array) {
	return Math.max.apply(null, array);
}

// addEventListener wrapper:
function on(target, type, callback) {
	target.addEventListener(type, callback, false);
}


// Refresh when there are updates:
var appCache = window.applicationCache;
on(appCache, 'updateready', function(e) {
	if (appCache.status == appCache.UPDATEREADY) {
		window.location.reload();
	}
});


// Update record:
var recordEl = document.getElementById('record');
function setRecord(lapsed) {
	record = lapsed;
	recordEl.textContent = record + 'ms';
}


// Update history:
var historyEl = document.getElementById('history');
var bars = historyEl.children;
function makeHistory(lapsed) {
	if (bars.length >= 10) {
		historyEl.removeChild(bars[0]);
		taps.shift();
	}

	var li = document.createElement('li');
	li.textContent = lapsed;

	taps.push(lapsed);
	if ( highest !== (highest = arrMax(taps)) ) {
		[].forEach.call(bars, function(el, i) {
			el.style.height = taps[i]/highest*100 + '%';
		});
	}
	li.style.height = lapsed/highest*100 + '%';
	historyEl.appendChild(li);
}


function reset() {
	record = last = highest = 0;
	taps = [];
	recordEl.textContent = '';
	prevTapWasReleased = false;
	historyEl.innerHTML = '';
}
reset();
var resetBtn = document.getElementById('reset');
on(resetBtn, 'click', reset);


// Listen for tap event:
var tapEvent = isTouchDevice ? 'touchstart' : 'mousedown';
var tapReleaseEvent = isTouchDevice ? 'touchend' : 'mouseup';
on(window, tapEvent, function tap(event) {
	if (event.target === resetBtn) return;
	event.preventDefault();
	if (!isTouchDevice && event.button !== 0) return;
	var now = Date.now();
	if (prevTapWasReleased) {
		var lapsed = now - last;
		if (!record || lapsed < record) setRecord(lapsed);
		makeHistory(lapsed);
	}
	last = now;
	prevTapWasReleased = false;
	on(window, tapReleaseEvent, tapRelease);
});

function tapRelease() {
	prevTapWasReleased = true;
}


// prevent default touch swipe action:
on(document.body, 'touchmove', function(event) {
	event.preventDefault();
});

// Trigger repaint for viewport units:
on(window, 'resize', function() {
	document.body.removeChild(document.body.appendChild(document.createElement('style')));
});