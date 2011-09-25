$(function() {
  // $(".info").playlists_manager();
	var $first_video = $("#playlist .video-item:first");
	if ($first_video.length > 0) {
		load_player($first_video.attr('ytid'));
	}
	
	$("#videos-list").playlist()
	
})