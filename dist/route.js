(function() {
  var Route, path, _;

  path = require('path');

  _ = require('lodash');

  Route = (function() {

    function Route(app, opts) {
      this.app = app;
      this.opts = opts;
    }

    Route.prototype.handler = function(req, res, next) {
      var controller, controller_path, _ref;
      controller_path = path.join(this.app.path.controllers, this.opts.controller);
      try {
        controller = require(controller_path);
      } catch (err) {
        if (err.code === 'MODULE_NOT_FOUND') {
          err.message = 'Could not find a controller at ' + controller_path;
        } else {
          err.message = 'Error requiring controller at ' + controller_path + ': ' + err.message;
        }
        return next(err);
      }
      if (!((controller[this.opts.action] != null) && typeof controller[this.opts.action] === 'function')) {
        return next(new Error('Controller at ' + controller_path + ' does not support requested action ' + this.opts.action));
      }
      if ((_ref = res._layer_cake) == null) {
        res._layer_cake = {};
      }
      _(res._layer_cake).extend(this.opts);
      return controller[this.opts.action](req, res, next);
    };

    return Route;

  })();

  module.exports = Route;

}).call(this);
