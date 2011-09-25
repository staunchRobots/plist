// Youtube
function is_youtube_url(url) {
  var valid = $.trim(url).match(/^(http:\/\/)?www.youtube.com\/watch\?v\=(.+)$/);
  if (valid !== null) {
    var querystring = url.split("?")[1].split('&');
    $(querystring).each(function() {
      var match = this.toString().match(/v\=(.+)/);
      if (match !== null) valid = match;
    });
  }
  return valid;
}



// Player
var player_el;
var playlist_cycle = [];
var playing_index = -1;

function load_player(ytid) {
  var params = {
    allowScriptAccess: "always",
    allowFullScreen: true
  };
  var atts = {
    id: "player-e"
  };
  if (!player_el) {
    swfobject.embedSWF("http://www.youtube.com/e/" + ytid + "?enablejsapi=1&playerapiid=ytplayer", "ytapiplayer", "855", "510", "8", null, null, params, atts, function(e) {
      player_el = $("#player-e").get(0);
    });
  }
}

function onYouTubePlayerReady(playerId) {
  var ytplayer = document.getElementById("player-e");
  $(ytplayer).attr("wmode", "transparent");
  $(ytplayer).css("position", "relative");
  ytplayer.addEventListener("onStateChange", "onytplayerStateChange");
}

function onytplayerStateChange(newState) {
  if (newState == 0) {
    play_next();
  }
}

function play(ytid) {
  $("#playlist .video-item").removeClass("playing");
  $("#playlist .video-item[ytid=" + ytid + "]").addClass("playing");
  try {
    $("#player-e").get(0).loadVideoById(ytid);
  } catch(e) {}
}

function rearrange_playlist() {
  var count = $("#playlist .video-item:visible").length;
  $("#playlist .video-item").hide();
  $("#playlist .video-item").slice(0, count).show();
}

$.widget("ui.playlist", {
  _init: function() {
    var $el = this.element;
    $el.find(".more-videos").live("click", function(e) {
      var count = $el.find(".video-item:visible").length;
      $el.addClass("more");
      $el.find(".video-item").slice(count, count + 5).show();
      if ($el.find(".video-item:last").has(":visible").length == 1) {
        $(this).hide();
      }
      e.preventDefault();
    });
    $("li.video-item a.play-item").live("click", function(e) {
      var id = $(this).attr('ytid');
      play(id);
      e.preventDefault();
    });
    $("li.video-item").live("mouseenter", function(e) {
      $(this).find(".add-to-playlist").show();
    }).live("mouseleave", function(e) {
      $(this).find(".add-to-playlist").hide();
    });

    $(".video-item .add-to-playlist").live("click", function(e) {
      e.preventDefault();
      e.stopPropagation();
      var $item = $(this).parent();
      if ($("#layouts #add-to-playlist-menu").length > 0) {
        $layout = $("#layouts #add-to-playlist-menu");
      } else {
        $layout = $el.find("#add-to-playlist-menu");
      }
      $layout.css({
        position: "absolute"
      });
      $item.append($layout.show());
    });
  }
});