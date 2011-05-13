function add_video_by_ytid(ytid) {
    var url= '/playlist/'+current_playlist+'/videos';
    $.post(url, {v:ytid}, function(res) {
	if (res == "ok") {
	    load_playlist(current_playlist);
	} else {
	    if(res.error) {
		alert(res.error);
	    }
	}
    });
}

function place_suggestions(suggestions) {
    var uids= [];
    $(suggestions).each(function() {
	uids.push(this.fb_uid);
    });
    var query= FB.Data.query('SELECT uid, name FROM user WHERE uid in ('+uids.join(',')+')');
    query.wait(function(rows) {
	var actors= {};
	$(rows).each(function() {
	    var row= this;
	    actors[row.uid]= row;
	});
	$.post("/suggestions", {suggestions:suggestions, actors:actors}, function(data) {
	    $("#suggestions ul").load("/suggestions li");
	});
    });
}

$.widget("ui.suggestions", {
    _init: function() {
	var $el= this.element;
	$el.find(".add").live("click", function(e) {
	    $(this).blur();
	    e.preventDefault();
	    var ytid= $(this).closest('li').attr('ytid');
	    add_video_by_ytid(ytid);
	});
    },
    load: function() {
    }
});

jQuery(document).ready(function() {
    var suggestions= [];
    $("#suggestions").suggestions();
    $(document).bind("FB_ready", function() {
	var query= FB.Data.query('SELECT post_id, actor_id, target_id, message FROM stream WHERE source_id in (SELECT target_id FROM connection WHERE source_id='+session.uid+') AND is_hidden = 0');
	query.wait(function(rows) {
	    console.log(rows);
	    $(rows).each(function() {
		var row= this;
		var message= row.message;
	    	var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
	    	var match= message.match(regexp);
		if (match) {
		    var url= match[0];
		    var valid_url= is_youtube_url(url);
	    	    if (valid_url) {
			suggestions.push({fb_uid:row.actor_id, ytid:valid_url[1]});
	    	    }
		}
	    });
	    place_suggestions(suggestions);
	});
    });
});

	// $(suggestions).each(function() {
	//     var $layout= $("#suggestions li.layout").clone();
	//     $layout.attr('ytid', this.ytid);
	//     $layout.find("img").attr('src', "http://img.youtube.com/vi/"+this.ytid+"/2.jpg");
	//     $layout.find(".by").text("Posted by: "+this.uid);
	//     $layout.removeClass("layout");
	//     $("#suggestions ul").prepend($layout.show());
	// });
