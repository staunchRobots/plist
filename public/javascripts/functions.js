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
  setCurrentPlayingIndex($(el))

  $("#playlist .video-item.playing").removeClass("playing");
  var current = $(el).addClass("playing");
  var ytid = $(el).attr('ytid')

  try {
    $("#player-e").get(0).loadVideoById(ytid);
  } catch(e) {}
}

function onytplayerStateChange(newState) {
  if (newState == 0) {
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


$.widget("ui.playlist", {
  _init: function() {
    var $el = this.element;
    // $el.find(".more-videos").live("click", function(e) {
    //   var count = $el.find(".video-item:visible").length;
    //   $el.addClass("more");
    //   $el.find(".video-item").slice(count, count + 5).show();
    //   if ($el.find(".video-item:last").has(":visible").length == 1) {
    //     $(this).hide();
    //   }
    //   e.preventDefault();
    // });
    $("li.video-item a.play-item").live("click", function(e) {
      play($(this).parent());
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

function hide_account_dropdown() {
  $(".account .dropdown").hide();
  $(".account").removeClass("on");
}
