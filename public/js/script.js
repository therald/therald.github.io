document.addEventListener("DOMContentLoaded", function(){
	begin();
});

function begin() {
	document.getElementById('hamburger_menu').onclick = function(e) {
		fadeContent(true);
	};

	document.getElementById('shadow_div').onclick = function(e) {
		fadeContent(false);
	};

	return false;
}

function fadeContent(showShadow) {
	var shadowDiv = document.getElementById("shadow_div");
	var dialog = document.getElementById("dialog");
	if (showShadow) {
		document.body.style.overflow = "hidden";

		dialog.style.opacity = "1";
		dialog.style.zIndex = "2";

		shadowDiv.style.display = "block";
		shadowDiv.style.opacity = "0.7";
		shadowDiv.style.zIndex = "1";

		setTimeout(function() {
			dialog.style.display = "block";
		}, 100);
	}
	else {
		shadowDiv.style.opacity = null;
		shadowDiv.style.zIndex = null;

		document.body.style.overflow = null;
		dialog.style.opacity = null;
		dialog.style.zIndex = null;

		setTimeout(function() {
			shadowDiv.style.display = null;
			dialog.style.display = null;
		}, 500);
	}
}