(function() {
  var Conf, DEBOUNCE_LIMIT, Promise, Queue, _, exit, fs, lockFile, log, md5, os, path,
    slice = [].slice;

  _ = require("lodash");

  md5 = require("md5");

  os = require("os");

  path = require("path");

  Promise = require("bluebird");

  Queue = require("p-queue");

  lockFile = Promise.promisifyAll(require("lockfile"));

  fs = Promise.promisifyAll(require("fs-extra"));

  exit = require("./exit");

  log = require('debug')('cypress:server:file');

  DEBOUNCE_LIMIT = 1000;

  module.exports = Conf = (function() {
    function Conf(options) {
      if (options == null) {
        options = {};
      }
      if (!options.path) {
        throw new Error("Must specify path to file when creating new FileUtil()");
      }
      this.path = options.path;
      this._lockFileDir = path.join(os.tmpdir(), "cypress");
      this._lockFilePath = path.join(this._lockFileDir, (md5(this.path)) + ".lock");
      this._queue = new Queue({
        concurrency: 1
      });
      this._cache = {};
      this._lastRead = 0;
      exit.ensure((function(_this) {
        return function() {
          return lockFile.unlockSync(_this._lockFilePath);
        };
      })(this));
    }

    Conf.prototype.transaction = function(fn) {
      return this._addToQueue((function(_this) {
        return function() {
          return fn({
            get: _this._get.bind(_this, true),
            set: _this._set.bind(_this, true)
          });
        };
      })(this));
    };

    Conf.prototype.get = function() {
      var args;
      args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      return this._get.apply(this, [false].concat(slice.call(args)));
    };

    Conf.prototype.set = function() {
      var args;
      args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      return this._set.apply(this, [false].concat(slice.call(args)));
    };

    Conf.prototype.remove = function() {
      this._cache = {};
      return this._lock().then((function(_this) {
        return function() {
          return fs.removeAsync(_this.path);
        };
      })(this))["finally"]((function(_this) {
        return function() {
          return _this._unlock();
        };
      })(this));
    };

    Conf.prototype._get = function(inTransaction, key, defaultValue) {
      var get;
      get = inTransaction ? this._getContents() : this._addToQueue((function(_this) {
        return function() {
          return _this._getContents();
        };
      })(this));
      return get.then(function(contents) {
        var value;
        if (key == null) {
          return contents;
        }
        value = _.get(contents, key);
        if (value === void 0) {
          return defaultValue;
        } else {
          return value;
        }
      });
    };

    Conf.prototype._getContents = function(inTransaction) {
      if (Date.now() - this._lastRead > DEBOUNCE_LIMIT) {
        this._lastRead = Date.now();
        return this._read().then((function(_this) {
          return function(contents) {
            return _this._cache = contents;
          };
        })(this));
      } else {
        return Promise.resolve(this._cache);
      }
    };

    Conf.prototype._read = function() {
      return this._lock().then((function(_this) {
        return function() {
          log('reading JSON file %s', _this.path);
          return fs.readJsonAsync(_this.path, "utf8");
        };
      })(this))["catch"]((function(_this) {
        return function(err) {
          if (err.code === "ENOENT" || err.code === "EEXIST" || err.name === "SyntaxError") {
            return {};
          } else {
            throw err;
          }
        };
      })(this))["finally"]((function(_this) {
        return function() {
          return _this._unlock();
        };
      })(this));
    };

    Conf.prototype._set = function(inTransaction, key, value) {
      var tmp, type, valueObject;
      if (!_.isString(key) && !_.isPlainObject(key)) {
        type = _.isArray(key) ? "array" : typeof key;
        throw new TypeError("Expected `key` to be of type `string` or `object`, got `" + type + "`");
      }
      valueObject = _.isString(key) ? (tmp = {}, tmp[key] = value, tmp) : key;
      if (inTransaction) {
        return this._setContents(valueObject);
      } else {
        return this._addToQueue((function(_this) {
          return function() {
            return _this._setContents(valueObject);
          };
        })(this));
      }
    };

    Conf.prototype._setContents = function(valueObject) {
      return this._getContents().then((function(_this) {
        return function(contents) {
          _.each(valueObject, function(value, key) {
            return _.set(contents, key, value);
          });
          _this._cache = contents;
          return _this._write();
        };
      })(this));
    };

    Conf.prototype._addToQueue = function(operation) {
      return Promise["try"]((function(_this) {
        return function() {
          return _this._queue.add(operation);
        };
      })(this));
    };

    Conf.prototype._write = function() {
      return this._lock().then((function(_this) {
        return function() {
          log('writing JSON file %s', _this.path);
          return fs.outputJsonAsync(_this.path, _this._cache, {
            spaces: 2
          });
        };
      })(this))["finally"]((function(_this) {
        return function() {
          return _this._unlock();
        };
      })(this));
    };

    Conf.prototype._lock = function() {
      return fs.ensureDirAsync(this._lockFileDir).then((function(_this) {
        return function() {
          return lockFile.lockAsync(_this._lockFilePath, {
            wait: 2000
          });
        };
      })(this));
    };

    Conf.prototype._unlock = function() {
      return lockFile.unlockAsync(this._lockFilePath);
    };

    return Conf;

  })();

}).call(this);
