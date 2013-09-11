(function() {
  var Route, Router,
    __slice = [].slice;

  Route = require('./route');

  Router = (function() {

    function Router(app) {
      this.app = app;
      this.opts = {};
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

    Router.prototype.all = function() {
      var filters, handler, path, _i, _ref;
      path = arguments[0], filters = 3 <= arguments.length ? __slice.call(arguments, 1, _i = arguments.length - 1) : (_i = 1, []), handler = arguments[_i++];
      return (_ref = this.app.express).all.apply(_ref, [path].concat(__slice.call((this.opts.filters || []).concat(filters)), [this._create_handler(handler)]));
    };

    Router.prototype.get = function() {
      var filters, handler, path, _i, _ref;
      path = arguments[0], filters = 3 <= arguments.length ? __slice.call(arguments, 1, _i = arguments.length - 1) : (_i = 1, []), handler = arguments[_i++];
      return (_ref = this.app.express).get.apply(_ref, [path].concat(__slice.call((this.opts.filters || []).concat(filters)), [this._create_handler(handler)]));
    };

    Router.prototype.post = function() {
      var filters, handler, path, _i, _ref;
      path = arguments[0], filters = 3 <= arguments.length ? __slice.call(arguments, 1, _i = arguments.length - 1) : (_i = 1, []), handler = arguments[_i++];
      return (_ref = this.app.express).post.apply(_ref, [path].concat(__slice.call((this.opts.filters || []).concat(filters)), [this._create_handler(handler)]));
    };

    Router.prototype.put = function() {
      var filters, handler, path, _i, _ref;
      path = arguments[0], filters = 3 <= arguments.length ? __slice.call(arguments, 1, _i = arguments.length - 1) : (_i = 1, []), handler = arguments[_i++];
      return (_ref = this.app.express).put.apply(_ref, [path].concat(__slice.call((this.opts.filters || []).concat(filters)), [this._create_handler(handler)]));
    };

    Router.prototype["delete"] = function() {
      var filters, handler, path, _i, _ref;
      path = arguments[0], filters = 3 <= arguments.length ? __slice.call(arguments, 1, _i = arguments.length - 1) : (_i = 1, []), handler = arguments[_i++];
      return (_ref = this.app.express)["delete"].apply(_ref, [path].concat(__slice.call((this.opts.filters || []).concat(filters)), [this._create_handler(handler)]));
    };

    Router.prototype.options = function() {
      var filters, handler, path, _i, _ref;
      path = arguments[0], filters = 3 <= arguments.length ? __slice.call(arguments, 1, _i = arguments.length - 1) : (_i = 1, []), handler = arguments[_i++];
      return (_ref = this.app.express).options.apply(_ref, [path].concat(__slice.call((this.opts.filters || []).concat(filters)), [this._create_handler(handler)]));
    };

    Router.prototype.patch = function() {
      var filters, handler, path, _i, _ref;
      path = arguments[0], filters = 3 <= arguments.length ? __slice.call(arguments, 1, _i = arguments.length - 1) : (_i = 1, []), handler = arguments[_i++];
      return (_ref = this.app.express).patch.apply(_ref, [path].concat(__slice.call((this.opts.filters || []).concat(filters)), [this._create_handler(handler)]));
    };

    Router.prototype.filter = function() {
      var filters, sub_router_method, _i;
      filters = 2 <= arguments.length ? __slice.call(arguments, 0, _i = arguments.length - 1) : (_i = 0, []), sub_router_method = arguments[_i++];
      this.opts.filters = (this.opts.filters || []).concat(filters);
      sub_router_method();
      return this.opts.filters = this.opts.filters.slice(0, -filters.length);
    };

    Router.prototype.resources = function() {
      var filters, handler, path, _i;
      path = arguments[0], filters = 3 <= arguments.length ? __slice.call(arguments, 1, _i = arguments.length - 1) : (_i = 1, []), handler = arguments[_i++];
      path = path.replace(/\/$/, '');
      handler = handler.split('#')[0];
      filters = (this.opts.filters || []).concat(filters);
      this.get.apply(this, [path].concat(__slice.call(filters), [handler]));
      this.get.apply(this, [path + '/new'].concat(__slice.call(filters), [handler + '#new']));
      this.post.apply(this, [path].concat(__slice.call(filters), [handler + '#create']));
      this.get.apply(this, [path + '/:id'].concat(__slice.call(filters), [handler + '#show']));
      this.get.apply(this, [path + '/:id/edit'].concat(__slice.call(filters), [handler + '#edit']));
      this.put.apply(this, [path + '/:id'].concat(__slice.call(filters), [handler + '#update']));
      return this["delete"].apply(this, [path + '/:id'].concat(__slice.call(filters), [handler + '#destroy']));
    };

    return Router;

  })();

  module.exports = Router;

}).call(this);
