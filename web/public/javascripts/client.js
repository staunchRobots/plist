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
    ytplayer = document.getElementById("player-e");
    if(playing_index == playlist_cycle.length) playing_index=0;
    ytplayer.loadVideoById(playlist_cycle[playing_index++]);
    console.log(playlist_cycle);
    console.log(playing_index);
}

function onYouTubePlayerReady(playerId) {
    ytplayer = document.getElementById("player-e");
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

/* load_playlist:
 * 
 *
 *
 */
function load_playlist() {
    $("#playlist").load("/playlist", function() {
	$("#playlist ul").sortable({containment:'parent',
				    update: function(e, ui) {
					var position= (function() {
					    var pos= parseInt($(ui.item).prev().attr('pos'));
					    var old_pos= parseInt($(ui.item).attr('pos'));
					    if (pos < old_pos) pos += 1;
					    return pos;
					})();
					$.post("/playlist/sort", {video:$(ui.item).attr("id"), pos:position}, function() {
					    load_playlist();
					});
				    }
				   });
	$("#playlist ul").disableSelection();
	calculate_playlist_cycle();
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

jQuery(document).ready(function($) {
    load_playlist();
    var params = { allowScriptAccess: "always" };
    var atts = { id: "player-e" };
    swfobject.embedSWF("http://www.youtube.com/e/DX1iplQQJTo?enablejsapi=1&playerapiid=ytplayer",
                       "ytapiplayer", "640", "390", "8", null, null, params, atts);

    $("#add-video .add-btn").click(function(e) {
	var valid_url= is_youtube_url($("#add-video input").val());
	if (valid_url !== null) {
	    $.post('/playlist', {v:valid_url[1]}, function(res) {
		if (res == "ok") {
		    load_playlist();
		} else 
		    if(res.error) {
			alert(res.error);
		    }
	    });
	    $("#add-video input").val("");
	} else {
	    alert("This doesn't seem to be a YouTube video");
	}
	e.preventDefault();
    });

    $("li.video-item .close").live("click", (function(e) {
	var id= $(this).closest(".video-item").attr("id");
	$.ajax({type:'DELETE', url: '/playlist/'+id, success: function(res) {
	    load_playlist();
	}});
	e.preventDefault();
	e.stopPropagation();
    }));

    
    $("li.video-item").live("click", function(e) {
	var id= $(this).attr('ytid');
	$("#player-e").get(0).loadVideoById(id);
	e.preventDefault();
    });

    /*
      *
      * Facebook Integration
      *
     */
    window.fbAsyncInit = function() {
	FB.init({appId: '270579051603', status: true, cookie: true, xfbml: true});

	FB.getLoginStatus(function(response) {
	    if (response.session) {
		// logged in and connected user, someone you know
		console.log(response.session);
		$.post('/login', {session:response.session}, function(data) {
		});
	    } else {
		// no user session available, someone you dont know
		console.log("not logged in");
	    }
	});

	FB.Event.subscribe('auth.login', function(response) {
	    $.post('/login', {session:response.session}, function(data) {
	    });
	});
	FB.Event.subscribe('auth.logout', function(response) {
	    $.post('/logout', {session:response.session}, function(data) {
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