$(function() {

  create_playlist = function(){
    var title = $(this).find('form input[type="text"]').val();
    
    if (title.length < 1) {
        alert('Invalid!\nPlease fill all required forms');
    } else {
        $(this).children('form').submit()
        $.fallr('hide');
    }
  }

  $(".create-playlist-btn").live('click', function(e) {
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

$(function() {

  var filterYoutube = function(){
    $(this).children('form').submit()
    $.fallr('hide');
  }

  $("#filter-btn").live('click', function(e) {
    $.fallr('show', {
        icon        : 'save',
        width       : '420px',
        content     : $(".filter-youtube-form").html(),
        buttons : {
            button1 : {text: 'Save', onclick: filterYoutube},
            button4 : {text: 'Cancel'}
        },
    });
    e.stopPropagation();
  })
})

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

$(function() {

  var login = function(){
      var user = $(this).children('form').children('input[type="text"]').val();
      var pass = $(this).children('form').children('input[type="password"]').val();
      if(user.length < 1 || pass.length < 1){
          alert('Invalid!\nPlease fill all required forms');
      } else {
          $(this).children('form').submit()
          // $.fallr('hide');
      }
  }

  var sign_up = function(){
      var user = $(this).children('form').children('input[name="user[email]"]').val();
      var name = $(this).children('form').children('input[name="user[name]"]').val();
      var username = $(this).children('form').children('input[name="user[username]"]').val();
      var pass = $(this).children('form').children('input[name="user[password]"]').val();
      var pass_confirm = $(this).children('form').children('input[name="user[password_confirmation]"]').val();
      if(user.length < 1 || pass.length < 1 || name.length < 1 || username.length < 1 || pass != pass_confirm){
          alert('Invalid!\nPlease fill all required forms');
      } else {
          $(this).children('form').submit()
          // $.fallr('hide');
      }
  }

  function showFLogin() {
    $.fallr('show', {
        icon        : 'secure',
        width       : '320px',
        content     : $(".login-form").html(),
        buttons : {
            button1 : {text: 'Sign in', onclick: login},
            button4 : {text: 'Cancel'}
        },
    }, function() {
      $('[placeholder]').blur()
    }); 
  }

  function showLogin() {
     if ($('#fallr-wrapper').length > 0) {
       $.fallr('hide', function() {
         showFLogin()
       })
     } else {
       showFLogin()
     }
   }

  function showFSignUp() {
    $.fallr('show', {
        icon        : 'secure',
        width       : '320px',
        content     : $(".sign-up-form").html(),
        buttons : {
            button1 : {text: 'Sign up', onclick: sign_up},
            button4 : {text: 'Cancel'}
        },
    }, function() {
      $('[placeholder]').blur()
    });
  }
  
  function showSignUp() {
    if ($('#fallr-wrapper').length > 0) {
      $.fallr('hide', function() {
        showFSignUp()
      })
    } else {
      showFSignUp()
    }
  }

  $(".sign-in").live('click', function(e) {
    showLogin()
    e.stopPropagation();
  })

  $(".sign-up-link").live('click', function(e) {
    showSignUp()
    e.stopPropagation();
  })

  $("#login-to-create").live('click', function(e) {
    $.fallr('show', {
        icon        : 'secure',
        width       : '370px',
        content     : 'In order to create a pList you first need to sign in  or create a new account',
        buttons : {
            button1 : {text: 'Create Account ', onclick: showSignUp},
            button2 : {text: 'Sign in', onclick: showLogin},
            button4 : {text: 'Cancel'}
        },
    });
    return false
  })

  $("#login-form").live('ajax:error', function(evt, data, status, xhr) {$.ctNotify(data.responseText, 'error')})
})

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
            button2 : {text: 'Done'},
        },
    }, function() {
      $('.invite_field:last').autocomplete({
        serviceUrl: '/invites/autocomplete',
        minChars: 3,
        zIndex: 9999,
      })
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

$(function() {
  var userSettings = function(){
    // var title = $(this).find('form input[type="text"]').val();
    //
    // if (title.length < 1) {
    //     alert('Invalid!\nPlease fill all required forms');
    // } else {
      $(this).children('form').submit()
      // $.fallr('hide');
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
