/* DO NOT MODIFY. This file was compiled Tue, 04 Oct 2011 11:54:58 GMT from
 * /Users/vladimirpenkin/Sites/plist/app/coffeescripts/routers/Welcome.coffee
 */

(function() {
  window.App.Routers.Welcome = Backbone.Router.extend({
    routes: {
      "": "index"
    },
    index: function() {
      return new window.App.Views.Welcome();
    }
  });
}).call(this);
