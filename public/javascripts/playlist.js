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