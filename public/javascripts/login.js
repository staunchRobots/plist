$(function() {

  var login = function(){
      var user = $(this).children('form').children('input[type="text"]').val();
      var pass = $(this).children('form').children('input[type="password"]').val();
      if(user.length < 1 || pass.length < 1){
          alert('Invalid!\nPlease fill all required forms');
      } else {
          $(this).children('form').submit()
          $.fallr('hide');
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
          $.fallr('hide');
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

})
