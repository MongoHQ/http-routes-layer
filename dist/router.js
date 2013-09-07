(function() {
  var Route, Router,
    __slice = [].slice;

  Route = require('./route');

  Router = (function() {

    function Router(app) {
      this.app = app;
    }

    Router.prototype._resolve_handler = function(handler) {
      var action, controller_path, _ref;
      _ref = handler.split('#'), controller_path = _ref[0], action = _ref[1];
      return {
        path: controller_path,
        controller: controller_path + '_controller',
        action: action != null ? action : 'index'
      };
    };

    Router.prototype._create_handler = function(handler) {
      var route;
      handler = this._resolve_handler(handler);
      route = new Route(this.app, handler);
      return route.handler.bind(route);
    };

    Router.prototype.get = function() {
      var handler, opts, _i, _ref;
      opts = 2 <= arguments.length ? __slice.call(arguments, 0, _i = arguments.length - 1) : (_i = 0, []), handler = arguments[_i++];
      return (_ref = this.app.express).get.apply(_ref, __slice.call(opts).concat([this._create_handler(handler)]));
    };

    Router.prototype.post = function() {
      var handler, opts, _i, _ref;
      opts = 2 <= arguments.length ? __slice.call(arguments, 0, _i = arguments.length - 1) : (_i = 0, []), handler = arguments[_i++];
      return (_ref = this.app.express).post.apply(_ref, __slice.call(opts).concat([this._create_handler(handler)]));
    };

    Router.prototype.put = function() {
      var handler, opts, _i, _ref;
      opts = 2 <= arguments.length ? __slice.call(arguments, 0, _i = arguments.length - 1) : (_i = 0, []), handler = arguments[_i++];
      return (_ref = this.app.express).put.apply(_ref, __slice.call(opts).concat([this._create_handler(handler)]));
    };

    Router.prototype["delete"] = function() {
      var handler, opts, _i, _ref;
      opts = 2 <= arguments.length ? __slice.call(arguments, 0, _i = arguments.length - 1) : (_i = 0, []), handler = arguments[_i++];
      return (_ref = this.app.express)["delete"].apply(_ref, __slice.call(opts).concat([this._create_handler(handler)]));
    };

    return Router;

  })();

  module.exports = Router;

}).call(this);
