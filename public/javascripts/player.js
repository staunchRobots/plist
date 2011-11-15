// Player
var player_el;
var playlist_cycle = [];
var playing_index = 0;

function setCurrentPlayingIndex(el) {
  if (el.parent().attr('id') == 'videos-list') {
    playing_index = el.parent().find("> li").index(el)
  } else {
    playing_index = -1
  }
}


function play(el) {
  if (!player_ready) {
    loadWhenReady = $(el)
    return false;
  }
  setCurrentPlayingIndex($(el))
  $("#playlist .video-item.playing").removeClass("playing");
  var current = $(el).addClass("playing");
  var ytid = $(el).attr('ytid')

  if (!player) {
    create_player(ytid)
  } else {
    player.loadVideoById(ytid)
  }
  
  if (watch == 0) {
    $.get('/users/'+current_user+'/playlists/'+current_playlist+'/play?video='+$(el).attr('id'));
  }
}

function onPlayerStateChange(event) {
  if (event.data == -1) {
    event.target.setPlaybackQuality('highres');
  }
  if(event.data == YT.PlayerState.ENDED){
    if (playing_index != -1) {
      play_next();
    }
  }
}

function getCurrentPlaying() {
  if (playing_index != -1) {
    return $("#playlist #videos-list > li").get(playing_index)
  }
}

function play_next() {
  var ytplayer = document.getElementById("player-e");

  var curr = getCurrentPlaying()
  if (curr.nextElementSibling != undefined) {
    playing_index += 1
  } else {
    playing_index = 0
  }

  var next_item = getCurrentPlaying()
  play(next_item)
}

$(function() {
  var $first_video = $("#playlist .video-item:first");
  if ($first_video.length > 0) {
    if (window.location.hash == '') {
      play($first_video);
    } else {
      var link_ytid = window.location.hash.substring(1);
      var linked_video = $("#playlist .video-item[ytid='"+link_ytid+"']")
      play(linked_video)
    }
  }

  $("#videos-list").playlist()
  $("#ytvideos-list").playlist()

})