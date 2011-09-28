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