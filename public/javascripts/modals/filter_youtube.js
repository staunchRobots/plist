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
