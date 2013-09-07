(function() {
  var Route, fs, glob, path;

  fs = require('fs');

  path = require('path');

  glob = require('glob');

  Route = (function() {

    function Route(app, opts) {
      this.app = app;
      this.opts = opts;
    }

    Route.prototype.view_paths = function(req, view) {
      var content_type;
      content_type = req.accepted[0].subtype;
      if (view[0] === '/') {
        view = path.join(this.app.path.views, view);
      } else {
        view = path.join(this.app.path.views, this.opts.path, view);
      }
      return [view, view + ("." + content_type), view + ("." + content_type + ".*"), view + '.*'];
    };

    Route.prototype.get_view_path = function(req, view) {
      var p, v, view_paths, _i, _len;
      view_paths = this.view_paths(req, view);
      for (_i = 0, _len = view_paths.length; _i < _len; _i++) {
        v = view_paths[_i];
        p = glob.sync(v);
        if ((p != null ? p.length : void 0) > 0) {
          return p[0];
        }
      }
      return null;
    };

    Route.prototype.handler = function(req, res, next) {
      var controller, controller_path, _render,
        _this = this;
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
      _render = res.render;
      res.render = function(view, data) {
        var ext, view_path;
        if ((view != null) && typeof view !== 'string') {
          data = view;
          view = null;
        }
        if (view == null) {
          view = _this.opts.action;
        }
        if (data == null) {
          data = {};
        }
        view_path = _this.get_view_path(req, view);
        if (view_path == null) {
          return next(new Error('Could not find a matching view for requested action ' + _this.opts.action + ' for controller at ' + controller_path + '. Views for this route are searched in this order: ' + _this.view_paths(req, view).join(', ')));
        }
        ext = path.extname(view_path).slice(1);
        if (_this.app.express.engines['.' + ext] == null) {
          _this.app.express.engine(ext, require(path.join(_this.app.path.root, 'node_modules', ext)).__express);
        }
        return _render.call(res, view_path, data);
      };
      return controller[this.opts.action](req, res, next);
    };

    return Route;

  })();

  module.exports = Route;

}).call(this);
