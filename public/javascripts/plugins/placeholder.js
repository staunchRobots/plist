$(document).ready(function(){

  if (!Modernizr.input.placeholder) {
    // regular placeholder
    $('[placeholder]').live('focus', function() {
      var input = $(this);
      if (input.val() == input.attr('placeholder')) {
        input.val('');
        input.removeClass('placeholder');
      }
    }).live('blur', function() {
      var input = $(this);
      if (input.val() == '' || input.val() == input.attr('placeholder')) {
        input.addClass('placeholder');
        input.val(input.attr('placeholder'));
      }
    });
    $('[placeholder]').parents('form').submit(function() {
      $(this).find('[placeholder]').each(function() {
      var input = $(this);
      if (input.val() == input.attr('placeholder')) {
        input.val('');
      }
      })
    })

    // password placeholder
    $(".txtPassword").live('focus', function() {
      $(this).hide()
      $('.password').show().css('display', 'block').focus()
    })
    $(".password").live('blur', function() {
      if ($(this).val() == '' || $(this).val() == $(this).attr('placeholder')) {
        $(this).hide()
        $('.txtPassword').show()
      }
    })

    $(".txtConfirmPassword").live('focus', function() {
      $(this).hide()
      $('.confirmPassword').show().focus()
    })
    $(".confirmPassword").live('blur', function() {
      if ($(this).val() == '' || $(this).val() == $(this).attr('placeholder')) {
        $(this).hide()
        $('.txtConfirmPassword').show()
      }
    })
  }
})
