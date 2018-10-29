(function() {
  var Watchers, _, chokidar, pathHelpers;

  _ = require("lodash");

  chokidar = require("chokidar");

  pathHelpers = require("./util/path_helpers");

  Watchers = (function() {
    function Watchers() {
      if (!(this instanceof Watchers)) {
        return new Watchers;
      }
      this.watchers = {};
    }

    Watchers.prototype.close = function() {
      var filePath, results;
      results = [];
      for (filePath in this.watchers) {
        results.push(this._remove(filePath));
      }
      return results;
    };

    Watchers.prototype.watch = function(filePath, options) {
      var w;
      if (options == null) {
        options = {};
      }
      _.defaults(options, {
        interval: 250,
        usePolling: true,
        useFsEvents: false,
        ignored: null,
        onChange: null,
        onReady: null,
        onError: null
      });
      w = chokidar.watch(filePath, options);
      this._add(filePath, w);
      if (_.isFunction(options.onChange)) {
        w.on("change", options.onChange);
      }
      if (_.isFunction(options.onReady)) {
        w.on("ready", options.onReady);
      }
      if (_.isFunction(options.onError)) {
        w.on("error", options.onError);
      }
      return this;
    };

    Watchers.prototype._add = function(filePath, watcher) {
      this._remove(filePath);
      return this.watchers[filePath] = watcher;
    };

    Watchers.prototype._remove = function(filePath) {
      var watcher;
      if (!(watcher = this.watchers[filePath])) {
        return;
      }
      watcher.close();
      return delete this.watchers[filePath];
    };

    return Watchers;

  })();

  module.exports = Watchers;

}).call(this);
