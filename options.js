function populate(stash_list) {
	mylog("populate()");
	$("dl#list").html("");
	$("div#list").html("");
	if ("groups" in stash_list) {
		stash_list.groups.forEach(function(group) {
			$("dl#list").append("<dt><h3>"+group.title+"</h3></dt>");
			group.items.forEach(function(item) {
				var open = "<span id='"+item.id+"' class='open' data-url='"+item.url+"'>"+item.title+"</span>";
				var remove = "<img class='remove' src='delete.png' data-url='"+item.url+"' />";
				$("dl#list").append("<dd>"+remove+" "+open+"</dd>");
			});
		});
	}
	$("button.open").click(restore);
	$("span.open").click(restore);
	$("img.remove").click(remove);
	$('select#group').prop('selectedIndex', stash_list.group_index);
}

function main() {
	//~ $("h1").html("Super henk");
	mylog("main()");

	/* Setup the links */
	$("button.default").bind( "click", default_stash_list);

	/* Read the stash list and populate the items */
	read_stash_list(populate);
};

/* c style */
document.addEventListener('DOMContentLoaded', main);
