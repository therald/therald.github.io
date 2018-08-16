document.addEventListener("DOMContentLoaded", function(){
	begin();
});

function begin() {
	loadMainPage("about_me.html");

	document.getElementById('hamburger_menu').onclick = function(e) {
		fadeContent(true);

		var drawer = document.getElementById("drawer");
		drawer.style.left = "0";

		buttonClicked(e, this);
	};

	document.getElementById('close_hamburger_menu').onclick = function(e) {
		fadeContent(false);

		var drawer = document.getElementById("drawer");
		drawer.style.left = "-100%";

		buttonClicked(e, this);
	};

	document.getElementById('shadow_div').onclick = function(e) {
		fadeContent(false);

		var drawer = document.getElementById("drawer");
		drawer.style.left = "-100%";

		var closeButton = document.getElementById("close_hamburger_menu");
		buttonClicked(e, closeButton);
	};

	//drawer links
	document.getElementById('about_link').onclick = function(e) {
		if (!checkActive(this)) {
			loadMainPage("about_me.html");
		}

		fadeContent(true);

		var drawer = document.getElementById("drawer");
		drawer.style.left = "0";

		var closeButton = document.getElementById("close_hamburger_menu");
		buttonClicked(e, closeButton);
	};

	document.getElementById('portfolio_link').onclick = function(e) {
		if (!checkActive(this)) {
			loadMainPage("portfolio.html");
		}

		fadeContent(true);

		var drawer = document.getElementById("drawer");
		drawer.style.left = "0";

		var closeButton = document.getElementById("close_hamburger_menu");
		buttonClicked(e, closeButton);
	};

	document.getElementById('resume_link').onclick = function(e) {
		if (!checkActive(this)) {
			loadMainPage("resume.html");
		}

		fadeContent(true);

		var drawer = document.getElementById("drawer");
		drawer.style.left = "0";

		var closeButton = document.getElementById("close_hamburger_menu");
		buttonClicked(e, closeButton);
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

function checkActive(element) {
	var classes = element.classList;
	var hasClass = false;
	for (var i = 0; i < classes.length; i++) {
		if (classes[i] == "active_link") {
			hasClass = true;
		}
	}

	return hasClass;
}

function loadMainPage(page) {
	var mainPage = document.getElementById("main_page");
	var xhr = new XMLHttpRequest();

	xhr.onload = function () {
        mainPage.innerHTML = this.response;
    };

    var locationSub = window.location.href;
    locationSub = locationSub.substring(0, locationSub.lastIndexOf('/'));

    xhr.open('GET', locationSub + '/pages/' + page, true);
    xhr.send();
}

function fadeContent(showShadow) {
	var shadowDiv = document.getElementById("shadow_div");
	if (showShadow) {
		shadowDiv.style.opacity = "0.7";
		shadowDiv.style.zIndex = "1";
	}
	else {
		shadowDiv.style.opacity = "0";
		shadowDiv.style.zIndex = "-1";
	}
}

function buttonClicked(e, object) {
	// Remove any old one
	var ripples = document.getElementsByClassName("ripple");
	for (var i = 0; i < ripples.length; i++) {
		ripples[i].className = "";
	}

	var posX = object.offsetLeft,
		posY = object.offsetTop,
		buttonWidth = object.width,
		buttonHeight = object.height;

	object.classList.add("ripple");

	if(buttonWidth >= buttonHeight) {
		buttonHeight = buttonWidth;
	} else {
		buttonWidth = buttonHeight;
	}

	var x = e.pageX - posX - buttonWidth / 2;
	var y = e.pageY - posY - buttonHeight / 2;

	object.style.width = buttonWidth;
	object.style.height = buttonHeight;
	object.style.top = y + 'px';
	object.style.left = x + 'px';
	object.classList.add("rippleEffect");
}