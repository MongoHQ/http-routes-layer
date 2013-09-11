_ = require 'lodash'
path = require 'path'

module.exports = (response) ->
  _render = response.render
  response.render = (view, data, callback) ->
    if typeof data is 'function'
      callback = data
      data = null
    if typeof view is 'function'
      callback = view
      view = null
      data = null
    if view? and typeof view isnt 'string'
      data = view
      view = null
    
    view ?= @_layer_cake.action
    data ?= {}
    
    view = path.join(@_layer_cake.path, view) if view[0] isnt '/'
    view = '/' + view unless view[0] is '/'
    _render.call(@, view, data, callback)
