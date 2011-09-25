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
    // anchors:{top: '40px'} // under the header
    position: "absolute",
    width: '400px',
    anchors:{bottom: 0, right: 0}
  });

  $(".actions_menu").clickMenu();

})
