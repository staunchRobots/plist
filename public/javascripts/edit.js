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

$.widget("ui.playlist_header", {
    _init: function() {
	var $el= this.element;
	var self= this;
	$el.find(".plist-title").hover(
	    function() {
		$el.find(".edit-title-notice").show();
	    },
	    function() {
		$el.find(".edit-title-notice").hide();
	    })
	    .click(function(e) {
		var $input= $("<input type='text'/>");
		var title= $(this).text();
		$input.val(title).addClass("title-edit");
		$(this).hide();
		$(this).parent().prepend($input);
		$input.focus();
		e.preventDefault();
	    });
	$el.find("input.title-edit").live("blur", function() {
	    $(this).remove();
	    $el.find(".plist-title").show();
	    self._update_title($(this).val());
	});
    },
    _update_title: function(title) {
	var $el= this.element;
	var url= "/"+session.username+"/"+current_playlist;
	$el.find("input.title-edit").val(title);
	$el.find(".plist-title").text(title);
	$.ajax({type:'PUT', data: {data: {title:title}}, url: url, success: function(res) {
	}});
    }
});

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
    $(".header").playlist_header();

    $(document).bind("FB_ready", function() {
	var query= FB.Data.query('SELECT post_id, actor_id, target_id, message FROM stream WHERE source_id in (SELECT target_id FROM connection WHERE source_id='+session.uid+') AND is_hidden = 0');
	query.wait(function(rows) {
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