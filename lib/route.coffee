# fs = require 'fs'
path = require 'path'

# q = require 'q'
_ = require 'lodash'
# glob = require 'glob'
# 
# collect_promises = (obj) ->
#   promises = []
#   
#   for k, v of obj
#     if q.isPromise(v)
#       console.log 'collect_promises', k
#       promises.push(v.then (r) ->
#         console.log 'promise', k, 'resolved', r
#         obj[k] = r
#       )
#     Array::push.apply(promises, collect_promises(v)) if _.isPlainObject(v)
#   
#   promises


class Route
  constructor: (@app, @opts) ->
  
  # view_paths: (req, view) ->
  #   content_type = req.accepted[0].subtype
  #   
  #   if view[0] is '/'
  #     view = path.join(@app.path.views, view)
  #   else
  #     view = path.join(@app.path.views, @opts.path, view)
  #   
  #   [
  #     view
  #     view + ".#{content_type}"
  #     view + ".#{content_type}.*"
  #     view + '.*'
  #   ]
  # 
  # get_view_path: (req, view) ->
  #   view_paths = @view_paths(req, view)
  #   for v in view_paths
  #     p = glob.sync(v)
  #     return p[0] if p?.length > 0
  #   null
  
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
    
    res._layer_cake ?= {}
    _(res._layer_cake).extend(@opts)
    
    controller[@opts.action](req, res, next)
    
    # ['send', 'json', 'jsonp'].forEach (method) ->
    #   old_method = res[method]
    #   res[method] = (code, data) ->
    #     console.log method, arguments
    #     # old_method.call(res, code, data)
    #     
    #     return old_method.apply(res, arguments) unless code? or data?
    #     return old_method.apply(res, arguments) if typeof code in ['number', 'string'] and not data?
    #     
    #     unless data?
    #       data = code
    #       code = null
    #     
    #     q.all(collect_promises(data)).then ->
    #       old_method.apply(res, arguments)
    #     , next
        
    #     
    #     unless code? or data?
    #       console.log 1
    #       return old_method.call(res)
    #     if typeof code in ['number', 'string'] and not data?
    #       console.log 2, code
    #       return old_method.call(res, code)
    #     

    #     
    #     if q.isPromise(data)
    #       console.log 3
    #       return data.then (-> old_method.call(res, code, data)), next
    #     
    #     console.log 4
    #     q.all(collect_promises(data)).then ->
    #       console.log data
    #       old_method.call(res, code, data)
    #     , next
    
    # Replace render to allow:
    # render(view)
    # render(data)
    # render(view, data)
    # _render = res.render
    # res.render = (view, data) =>
    #   if view? and typeof view isnt 'string'
    #     data = view
    #     view = null
    #   view ?= @opts.action
    #   data ?= {}
    #   
    #   view = path.join(@opts.path, view) if view[0] isnt '/'
    #   view = '/' + view unless view[0] is '/'
    #   _render.call(res, view, data)
      
      # q.all(collect_promises(data)).then (-> _render.call(res, view, data)), next
      
      # view_path = @get_view_path(req, view)
      # unless view_path?
      #   return next(new Error('Could not find a matching view for requested action ' + @opts.action + ' for controller at ' + controller_path + '. Views for this route are searched in this order: ' + @view_paths(req, view).join(', ')))
      
      # ext = path.extname(view_path).slice(1)
      # @app.express.engine(ext, require(path.join(@app.path.root, 'node_modules', ext)).__express) unless @app.express.engines['.' + ext]?
      
      # q.all(collect_promises(data)).then (-> _render.call(res, view_path, data)), next

module.exports = Route
