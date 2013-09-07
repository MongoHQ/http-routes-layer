Route = require './route'

class Router
  constructor: (@app) ->
  
  _resolve_handler: (handler) ->
    [controller_path, action] = handler.split('#')
    {
      path: controller_path
      controller: controller_path + '_controller'
      action: action ? 'index'
    }
  
  _create_handler: (handler) ->
    handler = @_resolve_handler(handler)
    route = new Route(@app, handler)
    route.handler.bind(route)
  
  get: (opts..., handler) -> @app.express.get(opts..., @_create_handler(handler))
  post: (opts..., handler) -> @app.express.post(opts..., @_create_handler(handler))
  put: (opts..., handler) -> @app.express.put(opts..., @_create_handler(handler))
  delete: (opts..., handler) -> @app.express.delete(opts..., @_create_handler(handler))

module.exports = Router
