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

	var accordionButtons = document.getElementsByClassName("accordion_button");
	for (var i = 0; i < accordionButtons.length; i++) {
		accordionButtons[i].addEventListener("click", function() {
			this.classList.toggle("active");

			var panel = this.nextElementSibling;
			if (panel.style.display === "block") {
				panel.style.display = "none";
			} else {
				panel.style.display = "block";
			}
		});
	}

	return false;
}

function fadeContent(show) {
	var shadowDiv = document.getElementById("shadow_div");
	var dialog = document.getElementById("menu_options");
	if (show) {
		document.body.style.overflow = "hidden";

		dialog.style.top = "4rem";

		shadowDiv.style.display = "block";
		shadowDiv.style.opacity = "0.7";
		shadowDiv.style.zIndex = "1";

		setTimeout(function() {
			dialog.style.display = "block";
		}, 100);
	}
	else {
		document.body.style.overflow = null;

		dialog.style.top = "-8rem";

		shadowDiv.style.opacity = null;
		shadowDiv.style.zIndex = null;

		setTimeout(function() {
			shadowDiv.style.display = null;
			dialog.style.display = null;
		}, 500);
	}
}