$(function() {

  // Account button
  $(".account").click(function(e) {
    if ($(this).hasClass("on") && $(e.target).closest(".dropdown").length == 0) {
      hide_account_dropdown();
      return false;
    }

    if ($(".account .dropdown").length > 0) {
      $(this).addClass('on');
      $(".account .dropdown").show();
    } else {
    }
    // e.stopPropagation();
  });

  $.ctNotifyOption({
    sticky: false,
    position: "fixed",
    width: '400px',
    anchors:{bottom: 0, right: 0}
  });


  $(document).ajaxStart(function() {
    // $.ctNotify("Loading", {type: "loading", delay:1000})
  })

  $(".actions_menu").clickMenu();
  $('.actions_menu .menu_action').live('click', function() {
    $(this).find('a').click()
    $('.actions_menu').trigger('closemenu')
  })

  $('.plus-more-action .menu_action').live('click', function() {
    $(this).find('a').click()
    $('.actions_menu').trigger('closemenu')
  })         
  
  $('#show_video_btn').click(function() {
    el = $(this);
    $('#ytplayer').toggle('fast', function() {
      if ($('#ytplayer').is(":visible")) {
        el.text('Hide video');
      } else {
        el.text('Show video');
      }
    })
  })

  search_autocomplete = $('.youtube_search').autocomplete({
    minChars: 3
  });

  $('.youtube_search').keyup(function(){
    jQTubeUtil.suggest($(this).val(), function(response){
      search_autocomplete.setOptions({lookup: response.suggestions});
    });
  });

})
