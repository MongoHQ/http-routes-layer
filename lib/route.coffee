path = require 'path'

class Route
  constructor: (@app, @opts) ->

  handler: (req, res, next) ->
    controller_path = path.join(@app.path.controllers, @opts.controller)
    try
      controller = require(controller_path)
    catch err
      if err.code is 'MODULE_NOT_FOUND'
        err.message = 'Could not find a controller at ' + controller_path
      else
        err.message = 'Error requiring controller at ' + controller_path + ': ' + err.message
      return next(err)
    
    unless controller[@opts.action]? and typeof controller[@opts.action] is 'function'
      return next(new Error('Controller at ' + controller_path + ' does not support requested action ' + @opts.action))
    
    res._layer_cake ?= {}
    res._layer_cake[k] = v for k, v of @opts
    
    controller[@opts.action](req, res, next)

module.exports = Route
