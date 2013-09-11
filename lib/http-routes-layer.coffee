path = require 'path'
Router = require './router'

module.exports = (app) ->
  app.path.controllers = path.join(app.path.app, 'controllers')
  
  app.sequence('http').insert(
    'http-routes', router.bind(app),
    replace: 'controllers'
  )

router = (callback) ->
  require('./response')(@express.response)
  
  try
    routes = require path.join(@path.app, 'routes')
  catch err
    return callback()
  
  router = new Router(@)
  routes(@, router)
  
  callback()
