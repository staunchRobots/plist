/* DO NOT MODIFY. This file was compiled Tue, 04 Oct 2011 11:54:58 GMT from
 * /Users/vladimirpenkin/Sites/plist/app/coffeescripts/views/welcome/Index.coffee
 */

(function() {
  window.App.Views.Index = Backbone.View.extend({
    el: '#content',
    initialize: function() {
      _.bindAll(this, 'render');
      return this.render();
    },
    render: function() {
      $(this.el).html(JST['welcome/index']());
      return this;
    }
  });
}).call(this);
