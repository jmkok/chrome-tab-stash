// Copyright (c) 2014 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

var stash_list;

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
	store_stash_list();
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

function add(id,title,url) {
	//~ $("ul#buttons").append("<li><button id='"+id+"' class='open' data-url='"+url+"'>"+title+"</button></li>");
	$("dl#list").append("<dd><span id='"+id+"' class='open' data-url='"+url+"'>"+title+"</span></dd>");
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

function select_group() {
	stash_list['group_index'] = $(this).prop('selectedIndex');
	store_stash_list(stash_list);
}

function main() {
  mylog("addEventListener()");

	/* Attach the functions */
  $("button.close").bind( "click", park);
  $("button.default").bind( "click", default_stash_list);
  $('select#group').bind( "change", select_group);

	/* Read the stash list and populate the items */
	read_stash_list(populate);
}

/* c style */
document.addEventListener('DOMContentLoaded', main);
