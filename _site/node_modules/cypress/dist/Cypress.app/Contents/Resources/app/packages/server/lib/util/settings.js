(function() {
  var Promise, _, errors, flattenCypress, fs, log, path, renameCommandTimeout, renameSupportFolder, renameVisitToPageLoad;

  _ = require("lodash");

  Promise = require("bluebird");

  path = require("path");

  fs = require("fs-extra");

  errors = require("../errors");

  log = require("../log");

  fs = Promise.promisifyAll(fs);

  flattenCypress = function(obj) {
    var cypress;
    if (cypress = obj.cypress) {
      return cypress;
    }
  };

  renameVisitToPageLoad = function(obj) {
    var v;
    if (v = obj.visitTimeout) {
      obj = _.omit(obj, "visitTimeout");
      obj.pageLoadTimeout = v;
      return obj;
    }
  };

  renameCommandTimeout = function(obj) {
    var c;
    if (c = obj.commandTimeout) {
      obj = _.omit(obj, "commandTimeout");
      obj.defaultCommandTimeout = c;
      return obj;
    }
  };

  renameSupportFolder = function(obj) {
    var sf;
    if (sf = obj.supportFolder) {
      obj = _.omit(obj, "supportFolder");
      obj.supportFile = sf;
      return obj;
    }
  };

  module.exports = {
    _pathToFile: function(projectRoot, file) {
      return path.join(projectRoot, file);
    },
    _err: function(type, file, err) {
      var e;
      e = errors.get(type, file, err);
      e.code = err.code;
      e.errno = err.errno;
      throw e;
    },
    _logReadErr: function(file, err) {
      return this._err("ERROR_READING_FILE", file, err);
    },
    _logWriteErr: function(file, err) {
      return this._err("ERROR_WRITING_FILE", file, err);
    },
    _write: function(file, obj) {
      if (obj == null) {
        obj = {};
      }
      return fs.outputJsonAsync(file, obj, {
        spaces: 2
      })["return"](obj)["catch"]((function(_this) {
        return function(err) {
          return _this._logWriteErr(file, err);
        };
      })(this));
    },
    _applyRewriteRules: function(obj) {
      if (obj == null) {
        obj = {};
      }
      return _.reduce([flattenCypress, renameVisitToPageLoad, renameCommandTimeout, renameSupportFolder], function(memo, fn) {
        var ret;
        if (ret = fn(memo)) {
          return ret;
        } else {
          return memo;
        }
      }, _.cloneDeep(obj));
    },
    id: function(projectRoot) {
      var file;
      file = this._pathToFile(projectRoot, "cypress.json");
      return fs.readJsonAsync(file).get("projectId")["catch"](function() {
        return null;
      });
    },
    exists: function(projectRoot) {
      var file;
      file = this._pathToFile(projectRoot, "cypress.json");
      return fs.statAsync(file).then(function() {
        return fs.accessAsync(projectRoot, fs.W_OK);
      })["catch"]({
        code: "ENOENT"
      }, (function(_this) {
        return function(err) {
          log("cannot find file %s", file);
          return _this._err("PROJECT_DOES_NOT_EXIST", projectRoot, err);
        };
      })(this))["catch"]((function(_this) {
        return function(err) {
          if (errors.isCypressErr(err)) {
            throw err;
          }
          return _this._logReadErr(file, err);
        };
      })(this));
    },
    read: function(projectRoot) {
      var file;
      file = this._pathToFile(projectRoot, "cypress.json");
      return fs.readJsonAsync(file)["catch"]({
        code: "ENOENT"
      }, (function(_this) {
        return function() {
          return _this._write(file, {});
        };
      })(this)).then((function(_this) {
        return function(json) {
          var changed;
          if (json == null) {
            json = {};
          }
          changed = _this._applyRewriteRules(json);
          if (_.isEqual(json, changed)) {
            return json;
          } else {
            return _this._write(file, changed);
          }
        };
      })(this))["catch"]((function(_this) {
        return function(err) {
          if (errors.isCypressErr(err)) {
            throw err;
          }
          return _this._logReadErr(file, err);
        };
      })(this));
    },
    readEnv: function(projectRoot) {
      var file;
      file = this._pathToFile(projectRoot, "cypress.env.json");
      return fs.readJsonAsync(file)["catch"]({
        code: "ENOENT"
      }, function() {
        return {};
      })["catch"]((function(_this) {
        return function(err) {
          if (errors.isCypressErr(err)) {
            throw err;
          }
          return _this._logReadErr(file, err);
        };
      })(this));
    },
    write: function(projectRoot, obj) {
      if (obj == null) {
        obj = {};
      }
      return this.read(projectRoot).then((function(_this) {
        return function(settings) {
          var file;
          _.extend(settings, obj);
          file = _this._pathToFile(projectRoot, "cypress.json");
          return _this._write(file, settings);
        };
      })(this));
    },
    remove: function(projectRoot) {
      return fs.unlinkSync(this._pathToFile(projectRoot, "cypress.json"));
    },
    pathToCypressJson: function(projectRoot) {
      return this._pathToFile(projectRoot, "cypress.json");
    }
  };

}).call(this);
