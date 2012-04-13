function hide_account_dropdown() {
  $(".account .dropdown").hide();
  $(".account").removeClass("on");
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
      // e.preventDefault();
    });
    $("li.video-item").live("mouseenter", function(e) {
      $(this).find(".add-to-playlist").show();
    }).live("mouseleave", function(e) {
      $(this).find(".add-to-playlist").hide();
    });

    $(".video-item .add-to-playlist").live("click", function(e) {
      // e.preventDefault();
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

$(function() {

  // Submit video by Enter
  $("#add-video input").keyup(function(e) {
    if (e.keyCode == 13) {
      $(this).blur();
      $("#add-video .add-btn").click();
    }
  });

  // Make videos sortable
  $("#playlist ul").sortable({
    containment: 'parent',
    update: function(e, ui) {
      var order = _.map($(this).sortable("toArray"), function(v, n) {
        return v.replace('video_', '');
      });
      $.post('/playlists/'+current_playlist+'/videos/reorder',{order: order});
    }

  });

  // Add playlist video button
  $("#add-video .add-btn").click(function(e) {
    var valid_url = is_youtube_url($("#add-video input[type='text']").attr('value'));
    if (valid_url !== null) {
      $("#add-video form").submit()
    } else {
      alert("This doesn't seem to be a YouTube video");
    }
    e.preventDefault();
  });

  // Search youtube video button
  $("#search-yt-video .add-btn").click(function(e) {
    if ($("#search-yt-video input[type='text']").attr('value').length > 0) {
      $("#yt-videos-page").attr('value', '0')
      $("#search-yt-video form").submit()
    } else {
      alert("Why search for empty string?");
    }
    e.preventDefault();
  });

  // Search youtube by Enter
  $("#search-yt-video input").keyup(function(e) {
    if (e.keyCode == 13) {
      $(this).blur();
      $("#search-yt-video .add-btn").click();
    }
  });

  $("#yt-next-search").live('click', function() {
    $("#yt-videos-page").attr('value', parseInt($("#yt-videos-page").attr('value'))+1)
    $("#search-yt-video form").submit()
  })

  $("#yt-prev-search").live('click', function() {
    if (parseInt($("#yt-videos-page").attr('value')) > 0) {
      $("#yt-videos-page").attr('value', parseInt($("#yt-videos-page").attr('value'))-1)
    }
    $("#search-yt-video form").submit()
  })



  // $("#playlist_published").live('change', function() {
  //   $.post("/playlists/" + current_playlist + '/published', {
  //     published: $("#playlist_published").attr("checked")
  //   },
  //   function() {
  //     // hello
  //   });
  // 
  // })


})
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
  // if ($first_video.length > 0) {
  //   if (window.location.hash == '') {
  //     play($first_video);
  //   } else {
  //     var link_ytid = window.location.hash.substring(1);
  //     var linked_video = $("#playlist .video-item[ytid='"+link_ytid+"']")
  //     play(linked_video)
  //   }
  // }

  $("#videos-list").playlist()
  $("#ytvideos-list").playlist()

})
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
  var embedCode = event.target.getVideoEmbedCode();
  var ifr_source = $(embedCode).attr('src');
  var wmode = "?wmode=transparent";
  $(embedCode).attr('src',ifr_source+wmode);

  event.target.playVideo();
}

// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.
var done = false;


function stopVideo() {
  player.stopVideo();
}

function create_player(ytid) {
  player = new YT.Player('ytapiplayer', {
    height: '270',
    width: '950',
    fmt: 22,
    // hd: true,
    videoId: ytid,
    playerVars: {
      'autoplay': 0,
      'wmode': 'transparent'
    },
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });	
}
$(function() {

  // Account button
  $(".account").click(function(e) {
    if ($(this).hasClass("on") && $(e.target).closest(".dropdown").length == 0) {
      hide_account_dropdown();
      return false;
    }

    if ($(".account .dropdown").length > 0) {
      $(this).addClass('on');
      $(".account .dropdown").show();
    } else {
    }
    // e.stopPropagation();
  });

  $.ctNotifyOption({
    sticky: false,
    position: "fixed",
    width: '400px',
    anchors:{bottom: 0, right: 0}
  });


  $(document).ajaxStart(function() {
    $.ctNotify("Loading", {type: "loading", delay:1000})
  })

  $(".actions_menu").clickMenu();
  $('.actions_menu .menu_action').live('click', function() {
    $(this).find('a').click()
    $('.actions_menu').trigger('closemenu')
  })

  $('.plus-more-action .menu_action').live('click', function() {
    $(this).find('a').click()
    $('.actions_menu').trigger('closemenu')
  })         
  
  $('#show_video_btn').click(function() {
    $('#ytplayer').toggle('fast')
  })

  search_autocomplete = $('.youtube_search').autocomplete({
    minChars: 3
  });

  $('.youtube_search').keyup(function(){
    jQTubeUtil.suggest($(this).val(), function(response){
      search_autocomplete.setOptions({lookup: response.suggestions});
    });
  });

})
