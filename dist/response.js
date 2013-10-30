(function() {
  var path;

  path = require('path');

  module.exports = function(response) {
    var _render;
    _render = response.render;
    return response.render = function(view, data, callback) {
      if (typeof data === 'function') {
        callback = data;
        data = null;
      }
      if (typeof view === 'function') {
        callback = view;
        view = null;
        data = null;
      }
      if ((view != null) && typeof view !== 'string') {
        data = view;
        view = null;
      }
      if (view == null) {
        view = this._layer_cake.action;
      }
      if (data == null) {
        data = {};
      }
      if (view[0] !== '/') {
        view = path.join(this._layer_cake.path, view);
      }
      if (view[0] !== '/') {
        view = '/' + view;
      }
      return _render.call(this, view, data, callback);
    };
  };

}).call(this);
