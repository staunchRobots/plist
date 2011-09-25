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


  $("#playlist_published").live('change', function() {
    $.post("/playlists/" + current_playlist + '/published', {
      published: $("#playlist_published").attr("checked")
    },
    function() {
      // hello
    });

  })


})