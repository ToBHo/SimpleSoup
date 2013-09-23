//filter duplicate posts from your soup timeline
var posts = [];

var filterPosts = function(){	
	console.log('start filtering...');
	var removed = 0;
	var analyzed = 0;
	$('div .post').each(function(){
		analyzed++;
		//1. extract postId
		var postId;
		//Post is repost
		if($(this).hasClass('post_repost')){
			postURL = $(this).find('div .source a[class="url avatarlink"]:first').attr('href').toString();
			postURL = postURL.split('/');
			postId = postURL[$.inArray('post', postURL) + 1];
		}
		//Post is original post
		else{
			postId = $(this).attr('id').toString().substring(4);
		}
		//2. check if post has already been seen
		//Post hasn't been seen yet
		if($.inArray(postId, posts)==-1){
			//Mark as already checked: class = simplesoup
			$(this).addClass('simplesoup');
			posts.push(postId);
		}
		//Check if post hass simplesoup class
		//If not remove it
		if($(this).hasClass('simplesoup')==false){
			console.log('Post ' + postId + ' is a duplicate. Remove!');
			$(this).remove();
			removed++;
		}		
	});
	console.log('Stopped filtering. Analyzed ' + analyzed + ' Removed ' + removed);
};


//call background to open a port to this tab
chrome.runtime.sendMessage({type: "announcement"});

//listen to incoming messages from background and handle them
chrome.runtime.onConnect.addListener(function(port) {
  port.onMessage.addListener(function(msg) {
  	if(msg.type == 'filter'){
    	console.log('Message incoming: ' + msg);
    	filterPosts();
    }
  });
});

filterPosts();