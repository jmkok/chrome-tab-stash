function mylog(txt) {
  $("ul#status").append('<li>'+txt+'</li>');
  console.log(txt);
}
function message(txt) {
  $("ul#status").append('<li>'+txt+'</li>');
  console.log(txt);
}

function read_stash_list(callback) {
	mylog("read_stash_list()");
	mylog('reading...');
	chrome.storage.sync.get("tab-stash",function(data) {
		mylog('Settings read');
		mylog(data);
		stash_list = data["tab-stash"];
		mylog(stash_list);
		//~ mylog(stash_list.groups);
		//~ mylog(stash_list.groups[2]);
		//~ mylog(stash_list.groups[2].title);
		//~ mylog(stash_list.groups[2].items);
		if (stash_list)
			callback(stash_list);
	});
}

function store_stash_list() {
	mylog("store_stash_list()");
	mylog(stash_list);
	if (!stash_list) {
		mylog('Error: No value specified');
		return;
	}
	mylog('saving...');
	chrome.storage.sync.set({'tab-stash': stash_list}, function() {
		mylog('Settings saved');
	});
}

function default_stash_list() {
	var list =
		{
			"group_index":1,
			"groups": [
			{"title":"Tech","items":[
				{'title':"Tweakers",'url':"http://tweakers.net/"},
				{'title':"Distrowatch",'url':"http://distrowatch.com/"},
				{'title':"Phoronix",'url':"http://www.phoronix.com/"},
			]},
			{"title":"Cars","items":[
				{'title':"Saab",'url':"http://www.saab.com/"},
				{'title':"Volvo",'url':"http://www.volvo.com/"},
				{'title':"BMW",'url':"http://www.bmw.com/"},
			]},
			{"title":"Other","items":[
			]},
		]}
	;
	stash_list = list;
	mylog(list);
	store_stash_list();
}
