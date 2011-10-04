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
})
