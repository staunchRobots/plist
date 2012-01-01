window.App.Views.Index = Backbone.View.extend

  el: '#content'

  initialize: ->
    _.bindAll this, 'render'
    @render()

  render: ->
    $(@el).html JST['welcome/index']()
    @

