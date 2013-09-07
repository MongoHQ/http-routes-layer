path = require 'path'
Router = require './router'

module.exports = (app) ->
  app.path.controllers = path.join(app.path.app, 'controllers')
  # app.path.views = path.join(app.path.app, 'views')
  # app.path.public = path.join(app.path.root, 'public')
  
  app.sequence('http').insert(
    'http-routes', router.bind(app),
    replace: 'controllers'
  )

router = (callback) ->
  try
    routes = require path.join(@path.app, 'routes')
  catch err
    return callback()
  
  router = new Router(@)
  routes(@, router)
  
  callback()
