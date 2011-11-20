$(function() {
  var options = function(){
    $(this).children('form').submit()
  }

  $("#options-btn").live('click', function(e) {
    $.fallr('show', {
        icon        : 'icon-save',
        width       : '420px',
        content     : $(".options-form").html(),
        buttons : {
            button1 : {text: 'Save', onclick: options},
            button2 : {text: 'Cancel'},
        },
    });
    e.stopPropagation();
  })
  
  $("#invite_btn").live('click', function(e) {
    var username = $(".invite_field:visible").attr('value');
    if (username.length > 0) {
    	$.ajax({
    		type: 'POST',
    		url: '/invites',
    		data: {playlist_id: current_playlist, username: username},
    		success: function(res) {}
    	});
  	} else {
  	  $.ctNotify("Enter username pls", 'error');
  	}
    e.stopPropagation();
  })
})
