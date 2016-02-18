function add_group(group) {
	//~ mylog("add_group");
	//~ $('select').append($("<option></option>").attr("value",group.title).text(group.title));
	$("dl#list").append("<dt>"+group.title+"</dt>");
	//~ mylog(group);
	//~ group.items.forEach(add_item);
}

function populate(stash_list) {
	mylog("populate()");
	if ("groups" in stash_list)
		stash_list.groups.forEach(add_group);
	$("button.open").bind( "click", restore);
	$("span.open").bind( "click", restore);
	$('select#group').prop('selectedIndex', stash_list.group_index);
}

function main() {
	//~ $("h1").html("Super henk");
	mylog("HENK");

	/* Setup the links */
	$("button.default").bind( "click", default_stash_list);

	/* Read the stash list and populate the items */
	read_stash_list(populate);
};

/* c style */
document.addEventListener('DOMContentLoaded', main);
