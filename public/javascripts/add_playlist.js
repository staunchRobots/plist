$(function() {

  var create_playlist = function(){
    var title = $(this).find('form input[type="text"]').val();
    
    if (title.length < 1) {
        alert('Invalid!\nPlease fill all required forms');
    } else {
        $(this).children('form').submit()
        $.fallr('hide');
    }
  }

  $(".create-playlist").live('click', function(e) {
    $.fallr('show', {
        icon        : 'news',
        width       : '420px',
        content     : $(".add-playlist-form").html(),
        buttons : {
            button1 : {text: 'Create', onclick: create_playlist},
            button4 : {text: 'Cancel'}
        },
    });
    e.stopPropagation();
  })
})
