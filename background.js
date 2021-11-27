let token = "";

console.log("adding message listener...");
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => { addMessageListener(request, sender, sendResponse) });

chrome.webRequest.onBeforeSendHeaders.addListener(
	function (details) {
		if (token == "") {
			let authArr = details.requestHeaders.filter(x => { return x.name == "Authorization" });

			console.log("authArr", authArr);

			if (authArr != null && authArr.length > 0) {
				token = authArr[0]["value"];
			}
		}
	}, { urls: ["*://api.thingiverse.com/things/*"], types: ["xmlhttprequest"] }, ["requestHeaders"]);


const addMessageListener = (request, sender, sendResponse) => {
	let thingId = request.thingId;

	if (thingId != null && thingId != undefined && thingId != "") {
		sendThingDetailsToContentScript(thingId);
		sendResponse("thing id received by bg: ", thingId);
		return true;
	} else {
		console.log("thing id not received.", request);
		sendResponse({ farewell: "bg received something but it wasn't the thingId" });
	}
}

const sendThingDetailsToContentScript = (thingId) => {
	(async () => {
		let details = await getThingDetails(thingId);

		console.log("details fetch done:", details);

		await chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
			console.log("tabs:", tabs);

			chrome.tabs.sendMessage(tabs[0].id, details, function (response) {
				console.log("response from content:", response)
			});
		});
	})();
}

const getThingDetails = async (thingId) => {
	let url = `https://api.thingiverse.com/things/${thingId}`;
	var ajaxResults;

	await fetch(url,
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
			ajaxResults = response;
		});

	return ajaxResults;
}