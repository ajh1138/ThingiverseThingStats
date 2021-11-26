// *** Icons grabbed from https://remixicon.com *** //
let likesIcon = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24'%3E%3Cpath fill='none' d='M0 0H24V24H0z'/%3E%3Cpath d='M17.363 11.045c1.404-1.393 3.68-1.393 5.084 0 1.404 1.394 1.404 3.654 0 5.047L17 21.5l-5.447-5.408c-1.404-1.393-1.404-3.653 0-5.047 1.404-1.393 3.68-1.393 5.084 0l.363.36.363-.36zm1.88-6.288c.94.943 1.503 2.118 1.689 3.338-1.333-.248-2.739-.01-3.932.713-2.15-1.303-4.994-1.03-6.856.818-2.131 2.115-2.19 5.515-.178 7.701l.178.185 2.421 2.404L11 21.485 2.52 12.993C.417 10.637.496 7.019 2.757 4.757c2.265-2.264 5.888-2.34 8.244-.228 2.349-2.109 5.979-2.039 8.242.228z'/%3E%3C/svg%3E";
let downloadsIcon = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24'%3E%3Cpath fill='none' d='M0 0h24v24H0z'/%3E%3Cpath d='M16 2l5 5v14.008a.993.993 0 0 1-.993.992H3.993A1 1 0 0 1 3 21.008V2.992C3 2.444 3.445 2 3.993 2H16zm-3 10V8h-2v4H8l4 4 4-4h-3z'/%3E%3C/svg%3E";
let collectionsIcon = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24'%3E%3Cpath fill='none' d='M0 0h24v24H0z'/%3E%3Cpath d='M12.414 5H21a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h7.414l2 2zM11 9v8h2V9h-2zm4 3v5h2v-5h-2zm-8 2v3h2v-3H7z'/%3E%3C/svg%3E";

window.onload = function () {
	console.log("page is loaded, yo");

	var thingId = getThingId();
	sendThingIdToBackgroundScript(thingId);
}

chrome.runtime.onMessage.addListener(
	function (request, sender, sendResponse) {
		var thingDetails = request.details;
		console.log("thingDetails", thingDetails);

		if (thingDetails != null && thingDetails != undefined && thingDetails != "") {
			sendResponse({ farewell: "content received thing details" });
			showThingDetails(thingDetails);
		} else {
			sendResponse({ farewell: "content received something that was not the details" });
		}
	}
);

getThingId = () => {
	var url = new URL(document.head.querySelector("meta[property='og:url']").content);
	console.log("url grabbed: ", url);
	let dirs = url.pathname.split("/");
	let parts = dirs[1].split(":");

	var thingId = parts[1];
	console.log("thingId grabbed.", thingId);
	return thingId;
}

sendThingIdToBackgroundScript = (thingId) => {
	console.log("sending id to bg: ", thingId);
	chrome.runtime.sendMessage({ thingId: thingId }, function (response) {
		console.log(response.farewell);
	});
}

showThingDetails = (thingDetails) => {
	let sideButtons = document.getElementsByClassName("SideMenuItem__itemContainer--2VO4t");
	console.log("side buttons", sideButtons);

	if (sideButtons != null && sideButtons != undefined && sideButtons.length > 0) {
		addStatistic("Likes", thingDetails["like_count"], likesIcon);
		addStatistic("Collections", thingDetails["collect_count"], collectionsIcon);
		addStatistic("Downloads", thingDetails["download_count"], downloadsIcon);
	} else {
		console.log("waiting for the sidebuttons because yay javascript is awesome and not slow and clunky at all.");
		// give the page some more time to display the buttons...
		setTimeout(() => { showThingDetails(thingDetails) }, 1000);
	}
}

addStatistic = (statName, statValue, statIcon) => {
	let sideButtons = document.getElementsByClassName("SideMenuItem__itemContainer--2VO4t");

	let btnToClone = sideButtons.item(1);

	let clone = btnToClone.cloneNode(true);

	let textNode = clone.getElementsByClassName("SideMenuItem__textWrapper--11bnt")[0];
	let iconNode = clone.getElementsByClassName("SideMenuItem__itemIcon--3JsMu")[0];
	let arrowNode = clone.childNodes[2];

	iconNode.style.cursor = "default";
	textNode.style.cursor = "default";

	textNode.textContent = statName + ": " + statValue;
	iconNode.setAttribute("src", statIcon);
	clone.removeChild(arrowNode);

	btnToClone.parentElement.appendChild(clone);
}