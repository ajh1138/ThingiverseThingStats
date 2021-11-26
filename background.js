let token = "";

chrome.runtime.onMessage.addListener(
	function (request, sender, sendResponse) {
		var thingId = request.thingId;

		if (thingId != null && thingId != undefined && thingId != "") {
			getThingDetails(thingId);
			sendResponse({ farewell: "bg received the thingId" });
		} else {
			sendResponse({ farewell: "bg received something but it wasn't the thingId" });
		}

	}
);

chrome.webRequest.onBeforeSendHeaders.addListener(
	function (details) {
		let authArr = details.requestHeaders.filter(x => { return x.name == "Authorization" });

		if (authArr != null && authArr.length > 0) {
			token = authArr[0]["value"];
		}
	}, { urls: ["*://api.thingiverse.com/things/*"], types: ["xmlhttprequest"] }, ["requestHeaders"]);



getThingDetails = (thingId) => {
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
