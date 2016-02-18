// Copyright (c) 2014 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

var stash_list;

function mylog(txt) {
  $("ul#status").append('<li>'+txt+'</li>');
  console.log(txt);
}
function message(txt) {
  $("ul#status").append('<li>'+txt+'</li>');
  console.log(txt);
}

function get_group_index() {
	return $('select#group').prop('selectedIndex');
}

function add_to_stash(title, url) {
	mylog("add_to_stash("+title+","+url+")");
	var item = {'title':title,'url':url};
	var idx = get_group_index();
	//~ mylog(idx);
	//~ mylog(stash_list);
	stash_list.groups[idx].items.push(item);
	//~ mylog(stash_list);
	save_stash_list();
}

function park() {
	mylog("park()");
  var queryInfo = {
    active: true,
    currentWindow: true
  };
  chrome.tabs.query(queryInfo, function(tabs) {
		mylog("tabs query done");
    var tab = tabs[0];
    //~ mylog(tab);
    //~ mylog("title: "+tab.title);
    //~ mylog("url: "+tab.url);
    add_to_stash(tab.title, tab.url);

    /* Close the tab */
    if (0)
			chrome.tabs.remove(tab.id);
  });
}

function restore(url) {
	mylog("restore()");
	mylog("this: "+this);
	mylog("title: "+$(this).html());
	mylog("id: "+$(this).attr("id"));
	mylog("data-url: "+$(this).attr("data-url"));
	var url = $(this).attr("data-url");
	var newtab = {
		url: url,
	};
	chrome.tabs.create(newtab);
}

function add(id,title,url) {
	//~ $("ul#buttons").append("<li><button id='"+id+"' class='open' data-url='"+url+"'>"+title+"</button></li>");
	$("dl#list").append("<dd><span id='"+id+"' class='open' data-url='"+url+"'>"+title+"</span></dd>");
}

function save_stash_list() {
	mylog("save_stash_list()");
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

function add_item(item) {
	//~ mylog("add_item");
	add(1,item.title,item.url);
}

function add_group(group) {
	//~ mylog("add_group");
	$('select').append($("<option></option>").attr("value",group.title).text(group.title));
	$("dl#list").append("<dt>"+group.title+"</dt>");
	//~ mylog(group);
	group.items.forEach(add_item);
}

function populate(stash_list) {
	if ("groups" in stash_list)
		stash_list.groups.forEach(add_group);
	$("button.open").bind( "click", restore);
	$("span.open").bind( "click", restore);
	$('select#group').prop('selectedIndex', stash_list.group_index);
}

function read_stash_list() {
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
			populate(stash_list);
	});
}

function setup_default() {
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
	save_stash_list();
}

function select_group() {
	stash_list['group_index'] = $(this).prop('selectedIndex');
	save_stash_list(stash_list);
}

document.addEventListener('DOMContentLoaded', function() {
  mylog("addEventListener()");

	/* Attach the functions */
  $("button.close").bind( "click", park);
  $("button.default").bind( "click", setup_default);
  $('select#group').bind( "change", select_group);

	/* Read the stash list and populate the items */
	read_stash_list();
});
