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
	populate(stash_list);
	store_stash_list();
}

function restore() {
	mylog("restore()");
	mylog("data-id: "+$(this).attr("data-id"));
	mylog("data-url: "+$(this).attr("data-url"));
	var url = $(this).attr("data-url");
	var newtab = {
		url: url,
	};
	chrome.tabs.create(newtab);
}

function remove_from_stash_list(title,url) {
	var removed = 0;
	mylog("remove_from_stash_list("+title+","+url+")");
	stash_list.groups.forEach(function (group) {
		group.items.forEach(function (item) {
			mylog("item:"+item.title);
			if (item.url == url) {
				mylog("remove:"+item.title);
				var index = group.items.indexOf(item);
				mylog("index:"+index);
				group.items.splice(index, 1);
				removed++;
			}
		});
	});
	if (removed) {
		populate(stash_list);
		store_stash_list();
	}
}

function remove() {
	mylog("remove()");
	mylog("data-title: "+$(this).attr("data-title"));
	mylog("data-id: "+$(this).attr("data-id"));
	mylog("data-url: "+$(this).attr("data-url"));
	var title = $(this).attr("data-title");
	var url = $(this).attr("data-url");
	remove_from_stash_list(title,url);
	//~ var newtab = {
		//~ url: url,
	//~ };
	//~ chrome.tabs.create(newtab);
}
