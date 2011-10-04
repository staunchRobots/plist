/* DO NOT MODIFY. This file was compiled Tue, 04 Oct 2011 12:40:48 GMT from
 * /Users/vladimirpenkin/Sites/plist/app/coffeescripts/app.coffee
 */

(function() {
  window.App = {
    Models: {},
    Routers: {},
    Collections: {},
    Views: {
      Welcome: {}
    },
    init: function() {
      new window.App.Routers.Welcome();
      return Backbone.history.start();
    }
  };
  $(function() {
    return window.App.init();
  });
}).call(this);
