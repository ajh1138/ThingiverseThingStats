let token = "";
let thingId = "";

chrome.webNavigation.onCompleted.addListener(function (details) {
	if (details.frameId == 0) {
		getThingIdFromUrl();
	}
}, { url: [{ urlPrefix: "https://www.thingiverse.com/thing:" }] });

chrome.webRequest.onBeforeSendHeaders.addListener(
	function (details) {
		let authArr = details.requestHeaders.filter(x => { return x.name == "Authorization" });

		if (authArr != null && authArr.length > 0) {
			token = authArr[0]["value"];
		}
	}, { urls: ["*://api.thingiverse.com/things/*"], types: ["xmlhttprequest"] }, ["requestHeaders"]);

getThingIdFromUrl = () => {
	chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
		let url = new URL(tabs[0].url);
		let dirs = url.pathname.split("/");
		let parts = dirs[1].split(":");

		thingId = parts[1];

		getThingDetails();
	});
}

getThingDetails = () => {
	let url = `https://api.thingiverse.com/things/${thingId}`;

	fetch(url,
		{
			method: "get",
			mode: "cors",
			credentials: "include",
			cache: "no-cache",
			headers: {
				"Content-Type": "application/json",
				"Authorization": `${token}`,
			}
		})
		.then(response => response.json())
		.then((response) => {
			sendThingDetailsToContentScript(response);
		});
}

sendThingDetailsToContentScript = (details) => {
	chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
		chrome.tabs.sendMessage(tabs[0].id, { details: details }, function (response) {
			console.log(response.farewell);
		});
	});
}
