fs = require 'fs'
path = require 'path'
glob = require 'glob'

class Route
  constructor: (@app, @opts) ->
  
  view_paths: (req, view) ->
    content_type = req.accepted[0].subtype
    
    if view[0] is '/'
      view = path.join(@app.path.views, view)
    else
      view = path.join(@app.path.views, @opts.path, view)
    
    [
      view
      view + ".#{content_type}"
      view + ".#{content_type}.*"
      view + '.*'
    ]
  
  get_view_path: (req, view) ->
    view_paths = @view_paths(req, view)
    for v in view_paths
      p = glob.sync(v)
      return p[0] if p?.length > 0
    null
  
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
    
    return next(new Error('Controller at ' + controller_path + ' does not support requested action ' + @opts.action)) unless controller[@opts.action]? and typeof controller[@opts.action] is 'function'
    
    # Replace render to allow:
    # render(view)
    # render(data)
    # render(view, data)
    _render = res.render
    res.render = (view, data) =>
      if view? and typeof view isnt 'string'
        data = view
        view = null
      view ?= @opts.action
      data ?= {}
      
      view_path = @get_view_path(req, view)
      unless view_path?
        return next(new Error('Could not find a matching view for requested action ' + @opts.action + ' for controller at ' + controller_path + '. Views for this route are searched in this order: ' + @view_paths(req, view).join(', ')))
      
      ext = path.extname(view_path).slice(1)
      @app.express.engine(ext, require(path.join(@app.path.root, 'node_modules', ext)).__express) unless @app.express.engines['.' + ext]?
      
      _render.call(res, view_path, data)
    
    controller[@opts.action](req, res, next)

module.exports = Route
