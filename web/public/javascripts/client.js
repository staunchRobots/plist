var session={};
var current_playlist=0;
var player_el;

// var websocket= new io.Socket(null, {port: 8080});
// websocket.connect();

function truncate(el, len) {
    len = len || 200;
    if (el) {
	var trunc = el.innerHTML;
	if (trunc.length > len) {

	    /* Truncate the content of the P, then go back to the end of the
	       previous word to ensure that we don't truncate in the middle of
	       a word */
	    trunc = trunc.substring(0, len);
	    // trunc = trunc.replace(/\w+$/, '');
	    
	    /* Add an ellipses to the end and make it a link that expands
	       the paragraph back to its original size */
	    trunc += '...';
	    el.innerHTML = trunc;
	}
    }
}

var playlist_cycle=[];
var playing_index= 0;

function play_next() {
    var ytplayer = document.getElementById("player-e");
    ytplayer.loadVideoById(playlist_cycle[++playing_index]);
    if(playing_index == playlist_cycle.length) playing_index=0;
}

function onYouTubePlayerReady(playerId) {
    var ytplayer = document.getElementById("player-e");
    ytplayer.addEventListener("onStateChange", "onytplayerStateChange");
}

function onytplayerStateChange(newState) {
    if (newState == 0) {
	play_next();
    }
}

function calculate_playlist_cycle() {
    playlist_cycle=[];
    $("li.video-item").each(function() {
	playlist_cycle.push($(this).attr('ytid'));
    });
}

/* load_videos:
 * 
 *
 *
 */
function load_videos(playlist, callback) {
    $("#playlist").load("/playlist/"+playlist+"/videos", function(data) {
	$("#playlist ul").sortable({containment:'parent',
				    update: function(e, ui) {
					var position= (function() {
					    var pos= parseInt($(ui.item).prev().attr('pos'));
					    var old_pos= parseInt($(ui.item).attr('pos'));
					    if (pos < old_pos) pos += 1;
					    return pos||0;
					})();
					$.post("/playlist/"+current_playlist+"/sort", {video:$(ui.item).attr("id"), pos:position}, function() {
					    if (position==0) load_playlists();
					    load_videos(current_playlist);
					});
				    }
				   });
	$("#playlist ul").disableSelection();
	calculate_playlist_cycle();
	var $video= $(data).find(".video-item:first");
	if ($video.length > 0) {
	    var ytid= $.trim($video.attr('ytid'));
	}
	if(callback) callback(ytid||null);
    });
}

function load_video(ytid) {
    if (!player_el) {
	load_player(ytid);
    } else {
	$(player_el).show();
	try {
	    player_el.cueVideoById(ytid);
	} catch(e) {
	}
    }
}

function load_playlist(playlist, callback) {
    load_videos(playlist, function(video) {
	if (video) {
	    load_video(video);
	} else {
	    if (player_el) $(player_el).hide();
	}
	if (callback) callback();
    });
}

function load_playlists() {
    var url= '/playlists';
    if (session.uid) url= '/'+session.uid+'/playlists';
    url += " li";
    $("#playlists ul").load(url, function() {
    });
}

function is_youtube_url(url) {
    var valid= $.trim(url).match(/^(http:\/\/)?www.youtube.com\/watch\?v\=(.+)$/);
    if(valid !== null) {
	var querystring= url.split("?")[1].split('&');
	$(querystring).each(function() {
	    var match= this.toString().match(/v\=(.+)/);
	    if (match !== null) valid= match;
	});
    }
    return valid;
}

function create_playlist(playlist) {
    var url= '/playlist';
    if (session.uid) url= '/'+session.uid+'/playlists';
    $.post(url, {playlist:playlist}, function(res) {
	load_playlists();
    });
}

function delete_video(id) {
    $.ajax({type:'DELETE', url: '/playlist/'+current_playlist+'/videos/'+id, success: function(res) {
	load_videos(current_playlist);
    }});
}

function delete_playlist(playlist) {
    $.ajax({type:'DELETE', url: '/playlist/'+playlist, success: function(res) {
	load_playlists();
    }});
}

function add_video(url) {
    var valid_url= is_youtube_url(url);
    if (valid_url !== null) {
	var url= '/playlist/'+current_playlist+'/videos';
	// if (session.uid) {
	//     url= '/'+session.uid+'/'+current_playlist+'/videos';
	// }
	$.post(url, {v:valid_url[1]}, function(res) {
	    if (res == "ok") {
		load_playlist(current_playlist, function() {
		    if ($(".video-item").length == 1) {
			load_playlists();
		    }
		});
	    } else {
		if(res.error) {
		    alert(res.error);
		}
	    }
	});
    } else {
	alert("This doesn't seem to be a YouTube video");
    }
}

function load_player(ytid) {
    var params = { allowScriptAccess: "always" };
    var atts = { id: "player-e" };
    if (!player_el) {
	swfobject.embedSWF("http://www.youtube.com/e/"+ytid+"?enablejsapi=1&playerapiid=ytplayer",
			   "ytapiplayer", "640", "390", "8", null, null, params, atts, function(e) {
			       player_el= $("#player-e").get(0);
			   });
    }
}

function show_profile_image(uid) {
    var $img= $("<img/>");
    $img.attr({width:20, height:20, src:"http://graph.facebook.com/"+uid+"/picture"});
    $(".top .img").append($img);
}

function show_ajax_loader() {
    $("#ajax-loader").show();
}

function hide_ajax_loader() {
    $("#ajax-loader").hide();
}

function hide_account_dropdown() {
    $(".account .dropdown").hide();
    $(".account").removeClass("on");
}

jQuery(document).ready(function($) {
    current_playlist= $(".playlist-item.on").attr('id');
    
    var $first_video= $("#playlist .video-item:first");
    if ($first_video.length > 0) {
	load_player($first_video.attr('ytid'));
    }
    
    calculate_playlist_cycle();
    
    $("#ajax-loader").ajaxStart(function() {
	$(this).show();
    });
    $("#ajax-loader").ajaxStop(function() {
	$(this).hide();
    });

    // Account box
    $(".account").click(function(e) {
	if ($(this).hasClass("on") && $(e.target).closest(".dropdown").length==0) {
	    hide_account_dropdown();
	    return false;
	}

	if ($(".account .dropdown").length > 0) {
	    $(this).addClass('on');
	    $(".account .dropdown").show();
	} else {
	    if ($(".account .sign-in").length > 0) {
		FB.login(function(response) {
		    // everything is done in event 'auth.login'
		});
	    }
	}
	// e.stopPropagation();
    });
    
    $(".account .member, .account .sign-in").click(function(e) {
	$(this).blur();
	e.preventDefault();
    });

    $(".account .logout").click(function(e) {
	FB.logout(function(response) {
	    $.post('/logout', {session:response.session}, function(data) {
		session= {};
		window.location='/';
	    });
	});
    });

    $(window).click(function(e) {
	if (!($(e.target).hasClass("dropdown")) && $(e.target).closest(".account").length == 0) {
	    hide_account_dropdown();
	}
    });

    // Add video input field
    var default_video_input_text= "Enter a URL of a youtube video to add it to your playlist";
    $("#add-video input")
	.addClass("empty")
	.val(default_video_input_text)
	.focus(function() {$(this).val("");$(this).removeClass("empty")})
	.bind("change blur", function() {
	    var val= $.trim($(this).val());
	    if (val) {
		$(this).removeClass("empty");	
	    } else {
		$(this).addClass("empty");
		$(this).val(default_video_input_text);
	    }
	})
	.keyup(function(e) {
	    if (e.keyCode == 13) {
		$(this).blur();
		$("#add-video .add-btn").click();
	    }
	});



    // Make playlists sortable
    $("#playlists ul").sortable({containment:'parent',
				 update: function(e, ui) {
				 }
				});


    // Click Add Video Btn
    // - it should validate url input
    // - context: valid url 
    // -- it should load anonymous playlist if !session
    // -- it should (which?) playlist if session
    // -- it should load playlists panel (left) if session
    $("#add-video .add-btn").click(function(e) {
	add_video($("#add-video input").val());
	$("#add-video input").val("");
	e.preventDefault();
    });

    $("li.video-item .close").live("click", (function(e) {
	var id= $(this).closest(".video-item").attr("id");
	delete_video(id);
	e.preventDefault();
	e.stopPropagation();
    }));

    
    $("li.video-item").live("click", function(e) {
	var id= $(this).attr('ytid');
	$("#player-e").get(0).loadVideoById(id);
	e.preventDefault();
	playing_index= parseInt($(this).attr("pos"));
    });

    $("#add-playlist-btn a").click(function(e) {
	$(this).blur();
	var $layout= $(".playlist-item.layout").clone();
	$layout
	    .removeClass("layout")
	    .addClass("new")
	    .show()
	    .find(".title")
	      .hide();
	var $input= $("<input/>");
	$("#add-playlist-btn").addClass("on");
        $layout.find("a.info").append($input.attr("type", "text"));
	$("#playlists ul").append($layout);
	$layout
	    .find("input")
	      .focus()
	    .end()
	    .find(".edit")
	      .show()
	      .find(".cancel").click(function(e) {
		  $layout.fadeOut(function() { $(this).remove() });
		  $(this).blur();
		  e.preventDefault();
	      });

	$layout.find(".ok").click(function(e) {
	    $(this).blur();
	    e.preventDefault();
	    var title= $layout.find("input").val();
	    if ($.trim(title)) {
		var playlist= {title:title};
		create_playlist(playlist);
	    } else {
		alert("Enter a title for your playlist");
	    }
	});
	e.preventDefault();
    });


    // $("#add-playlist-btn a").click();

    $("#playlists li a").live("click", function(e) {
	if ($(this).attr("href")=="#") {
	    $(this).blur();
	    var $item= $(this).closest(".playlist-item");
	    current_playlist= $item.attr("id");
	    $("#playlists li.on").removeClass('on');
	    $item.addClass('on');
	    $(".header .plist-title").text($(this).find(".title").text());
	    load_playlist($item.attr("id"));
	    e.preventDefault();
	}
    });

    $(".playlist-item .delete").live("click", function(e) {
	e.stopPropagation();
	e.preventDefault();
	var $item= $(this).closest(".playlist-item");
	var x= window.confirm("Are you sure?")
	if (x)
	    delete_playlist($item.attr("id"));
    });

    $("#playlist ul").sortable({containment:'parent',
				update: function(e, ui) {
				    var position= (function() {
					var pos= parseInt($(ui.item).prev().attr('pos'));
					var old_pos= parseInt($(ui.item).attr('pos'));
					if (pos < old_pos) pos += 1;
					return pos||0;
				    })();
				    $.post("/playlist/"+current_playlist+"/sort", {video:$(ui.item).attr("id"), pos:position}, function() {
					if (position==0) load_playlists();
					load_videos(current_playlist);
				    });
				}
			       });
    
    /*
      *
      * Facebook Integration
      *
     */
    window.fbAsyncInit = function() {
	var appId= '270579051603';
	if (window.location.href.match(/plist\.tv/)) {
	    appId= '133998703298878';
	}

	FB.init({appId: appId, status: true, cookie: true, xfbml: true});

	FB.getLoginStatus(function(response) {
	    if (response.session) {
		// logged in and connected user, someone you know
		$.post('/login', {session:response.session}, function(data) {
		    if (data == "ok") {
			session= response.session;
			show_profile_image(session.uid);
			// load_playlists();
		    }
		});
	    } else {
		// no user session available, someone you dont know
		// load_playlists();
	    }
	});

	FB.Event.subscribe('auth.login', function(response) {
	    $.post('/login', {session:response.session}, function(data) {
		if (data == 'ok') {
		    window.location= "/";
		} else if(data.signup) {
		    FB.api('/me', function(response) {
			$.post('/signup', {member:response}, function(data) {
			    if (data == 'ok') {
				window.location='/';
			    }
			});
		    });
		} else {
		}
	    });
	});
	FB.Event.subscribe('auth.logout', function(response) {
	    $.post('/logout', {session:response.session}, function(data) {
		session= {};
		window.location='/';
	    });
	});

    };

    (function() {
    	var e = document.createElement('script');
    	e.type = 'text/javascript';
    	e.src = document.location.protocol +
    	    '//connect.facebook.net/en_US/all.js';
    	e.async = true;
    	document.getElementById('fb-root').appendChild(e);
    }());
});