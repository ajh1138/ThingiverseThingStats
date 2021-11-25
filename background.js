chrome.webNavigation.onCompleted.addListener(function(details) {
	if(details.frameId == 0){
		chrome.identity.getAuthToken({ 'interactive': true }, function(token) {
			if (token){
				console.log('token is ' + token);
				myToken = token;
			}
			else{
				console.log('token not present')
			}
		  });
	}
});

console.log("hi from background!");