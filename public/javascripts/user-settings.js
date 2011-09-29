$(function() {

  var userSettings = function(){
    // var title = $(this).find('form input[type="text"]').val();
    //
    // if (title.length < 1) {
    //     alert('Invalid!\nPlease fill all required forms');
    // } else {
      $(this).children('form').submit()
      $.fallr('hide');
    // }
  }

  $(".settings-link").live('click', function(e) {
    $.fallr('show', {
        icon        : 'save',
        width       : '420px',
        content     : $(".user-settings-form").html(),
        buttons : {
            button1 : {text: 'Save', onclick: userSettings},
            button4 : {text: 'Cancel'}
        },
    });
    e.stopPropagation();
  })
})
