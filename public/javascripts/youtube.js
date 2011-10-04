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

function load_player(ytid) {
  var params = {
    allowScriptAccess: "always",
    allowFullScreen: true
  };
  var atts = {
    id: "player-e"
  };
  if (!player_el) {
    swfobject.embedSWF("http://www.youtube.com/e/" + ytid + "?enablejsapi=1&playerapiid=ytplayer", "ytapiplayer", "940", "510", "8", null, null, params, atts, function(e) {
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
