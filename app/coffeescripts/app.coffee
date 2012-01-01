window.App =
  Models: {}
  Routers: {}
  Collections: {}
  Views:
    Welcome: {}
  init: ->
    new window.App.Routers.Welcome()
    Backbone.history.start()

$(->
  window.App.init()
)

