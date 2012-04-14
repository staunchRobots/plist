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
  
  
  
  /**
   * This javascript file checks for the brower/browser tab action.
   * It is based on the file menstioned by Daniel Melo.
   * Reference: http://stackoverflow.com/questions/1921941/close-kill-the-session-when-the-browser-or-tab-is-closed
   */
  var validNavigation = false;
   
  function endSession() {
    // Browser or broswer tab is closed
    // Do sth here ...
    $.get('/bye?playlist_id='+current_playlist+'&user_id='+current_id)
  }
   
  function wireUpEvents() {
    /*
    * For a list of events that triggers onbeforeunload on IE
    * check http://msdn.microsoft.com/en-us/library/ms536907(VS.85).aspx
    */
    window.onbeforeunload = function() {
        if (!validNavigation) {
           endSession();
        }
    }
   
    // Attach the event keypress to exclude the F5 refresh
    $('html').bind('keypress', function(e) {
      if (e.keyCode == 116){
        validNavigation = true;
      }
    });
   
    // Attach the event click for all links in the page
    $("a").bind("click", function() {
      validNavigation = true;
    });
   
    // Attach the event submit for all forms in the page
    $("form").bind("submit", function() {
      validNavigation = true;
    });
   
    // Attach the event click for all inputs in the page
    $("input[type=submit]").bind("click", function() {
      validNavigation = true;
    });
     
  }
   
  // Wire up the events as soon as the DOM tree is ready
  $(document).ready(function() {
    wireUpEvents(); 
  });     

})
