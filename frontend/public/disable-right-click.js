document.addEventListener('DOMContentLoaded', function() {
	document.addEventListener('contextmenu', function(e) {
		if (e.target.tagName === 'IMG') {
			e.preventDefault();
		}
	});
});
