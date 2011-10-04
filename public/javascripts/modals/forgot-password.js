$(function() {

  var forgot_password = function(){
      var user = $(this).children('form').children('input[type="text"]').val();
      if(user.length < 1){
          alert('Invalid!\nPlease fill all required fields');
      } else {
          $(this).children('form').submit()
          $.fallr('hide');
      }
  }

  function showFForgot() {
    $.fallr('show', {
        icon        : 'secure',
        width       : '420px',
        content     : $(".forgot-password-form").html(),
        buttons : {
            button1 : {text: 'Send me reset password instructions', onclick: forgot_password},
            button4 : {text: 'Cancel'}
        },
    });
  }

  function showForgot() {
     if ($('#fallr-wrapper').length > 0) {
       $.fallr('hide', function() {
         showFForgot()
       })
     } else {
       showFForgot()
     }
   }


  $(".forgot-password-link").live('click', function(e) {
    showForgot()
    e.stopPropagation();
  })


})
