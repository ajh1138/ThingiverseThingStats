
window.onload = function () {
	console.log("page is loaded, yo");

	getThingDetails();

	let sideButtons = document.getElementsByClassName("SideMenuItem__itemContainer--2VO4t");

	if (sideButtons != null) {
		console.log("got it.", sideButtons);
		let btnToClone = sideButtons.item(1);
		console.log("btntoclone", btnToClone);
		let clone = btnToClone.cloneNode(true);
		let textNode = clone.getElementsByClassName("SideMenuItem__textWrapper--11bnt");
		textNode[0].textContent = "Farts and Poop";

		btnToClone.parentElement.appendChild(clone);
	}
}

getThingDetails = () => {
	let myToken = "";

	

	fetch("https://api.thingiverse.com/things/4592934",
		{
			method: "get",
			mode: "cors",
			cache: "no-cache",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${myToken}`
			}
		}
	).then((response) => {
		console.log("response:", response.text);
	});
}