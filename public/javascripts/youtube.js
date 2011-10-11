// // Youtube
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

// 2. This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script');
tag.src = "http://www.youtube.com/player_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
var player = false;
var player_ready = false;
var loadWhenReady = false
function onYouTubePlayerAPIReady(idvideo) {
  player_ready = true;
  if (loadWhenReady) {
    play(loadWhenReady)
  }
}

// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
  evt.target.playVideo();
}

// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.
var done = false;
// function onPlayerStateChange(event) {
//
//     //When the player ends it load another video
//   if(event.data == YT.PlayerState.ENDED){
//       player.loadVideoById('dsz-EeNZBkI', 0); //JW5meKfy3fY
//   }
// }

function stopVideo() {
  player.stopVideo();
}

function create_player(ytid) {
  player = new YT.Player('ytapiplayer', {
    height: '510',
    width: '940',
    videoId: ytid,
    playerVars: {
      'autoplay': 0
    },
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });

}