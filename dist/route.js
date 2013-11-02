(function() {
  var Route, path;

  path = require('path');

  Route = (function() {

    function Route(app, opts) {
      this.app = app;
      this.opts = opts;
    }

    Route.prototype.handler = function(req, res, next) {
      var controller, controller_path, k, v, _ref, _ref1;
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
      _ref1 = this.opts;
      for (k in _ref1) {
        v = _ref1[k];
        res._layer_cake[k] = v;
      }
      return controller[this.opts.action](req, res, next);
    };

    return Route;

  })();

  module.exports = Route;

}).call(this);
