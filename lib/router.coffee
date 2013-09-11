Route = require './route'

class Router
  constructor: (@app) ->
    @opts = {}
  
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
  
  all: (path, filters..., handler) -> @app.express.all(path, (@opts.filters or []).concat(filters)..., @_create_handler(handler))
  get: (path, filters..., handler) -> @app.express.get(path, (@opts.filters or []).concat(filters)..., @_create_handler(handler))
  post: (path, filters..., handler) -> @app.express.post(path, (@opts.filters or []).concat(filters)..., @_create_handler(handler))
  put: (path, filters..., handler) -> @app.express.put(path, (@opts.filters or []).concat(filters)..., @_create_handler(handler))
  delete: (path, filters..., handler) -> @app.express.delete(path, (@opts.filters or []).concat(filters)..., @_create_handler(handler))
  options: (path, filters..., handler) -> @app.express.options(path, (@opts.filters or []).concat(filters)..., @_create_handler(handler))
  patch: (path, filters..., handler) -> @app.express.patch(path, (@opts.filters or []).concat(filters)..., @_create_handler(handler))
  
  filter: (filters..., sub_router_method) ->
    @opts.filters = (@opts.filters or []).concat(filters)
    sub_router_method()
    @opts.filters = @opts.filters.slice(0, -filters.length)
  
  resources: (path, filters..., handler) ->
    path = path.replace(/\/$/, '')
    handler = handler.split('#')[0]
    filters = (@opts.filters or []).concat(filters)
    
    @get(path,               filters..., handler)
    @get(path + '/new',      filters..., handler + '#new')
    @post(path,              filters..., handler + '#create')
    @get(path + '/:id',      filters..., handler + '#show')
    @get(path + '/:id/edit', filters..., handler + '#edit')
    @put(path + '/:id',      filters..., handler + '#update')
    @delete(path + '/:id',   filters..., handler + '#destroy')

module.exports = Router
