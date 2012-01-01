window.App.Routers.Welcome = Backbone.Router.extend
  routes:
    "": "index"

  index: ->
    new window.App.Views.Welcome()

