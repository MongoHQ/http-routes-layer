(function() {
  var Router, path, router;

  path = require('path');

  Router = require('./router');

  module.exports = function(app) {
    app.path.controllers = path.join(app.path.app, 'controllers');
    return app.sequence('http').insert('http-routes', router.bind(app), {
      replace: 'controllers'
    });
  };

  router = function(callback) {
    var routes;
    require('./response')(this.express.response);
    try {
      routes = require(path.join(this.path.app, 'routes'));
    } catch (err) {
      return callback();
    }
    router = new Router(this);
    routes(this, router);
    return callback();
  };

}).call(this);
