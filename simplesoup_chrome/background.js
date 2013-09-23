//Ports to send messages to
var ports = [];

//Add a port to send messages to
var addPort = function(tab){
	var newPort = chrome.tabs.connect(tab);
	newPort.onDisconnect.addListener(function(port){
		//remove Port from ports
		console.log('Port' + port.portId_ + ' wants to disconnect!');
		for(var i=0; i<ports.length; i++)
			if(ports[i].port.portId_ == port.portId_){
				console.log('Tab ' + ports[i].id + ' disconnected!');
				ports.splice(i,1);	
			}
	});
	ports.push({id: tab, port: newPort});
	return true;
}

//Listen for announcements from Soup-tabs
chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		if (request.type == "announcement"){
			addPort(sender.tab.id)
     		console.log("Port added for tab " + sender.tab.id);
     	}
	});

//callback to all known Soup-tabs
var callback = function(){
	console.log('New posts. Sending "filter"!');
	for(var i=0; i<ports.length; i++){
		ports[i].port.postMessage({type: 'filter'});
	}
}

//Listen to webRequests fitting into the filter and callback
var filter = {urls:["*://www.soup.io/friends?since=*"]};
chrome.webRequest.onCompleted.addListener(callback, filter);