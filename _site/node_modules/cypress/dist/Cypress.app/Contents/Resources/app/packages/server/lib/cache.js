(function() {
  var FileUtil, Promise, _, appData, convertProjectsToArray, fileUtil, fs, logger, path, renameSessionToken,
    slice = [].slice;

  _ = require("lodash");

  fs = require("fs-extra");

  path = require("path");

  Promise = require("bluebird");

  appData = require("./util/app_data");

  FileUtil = require("./util/file");

  logger = require("./logger");

  fs = Promise.promisifyAll(fs);

  fileUtil = new FileUtil({
    path: appData.path("cache")
  });

  convertProjectsToArray = function(obj) {
    if (!_.isArray(obj.PROJECTS)) {
      obj.PROJECTS = _.chain(obj.PROJECTS).values().map("PATH").compact().value();
      return obj;
    }
  };

  renameSessionToken = function(obj) {
    var st;
    if (obj.USER && (st = obj.USER.session_token)) {
      delete obj.USER.session_token;
      obj.USER.sessionToken = st;
      return obj;
    }
  };

  module.exports = {
    path: fileUtil.path,
    defaults: function() {
      return {
        USER: {},
        PROJECTS: []
      };
    },
    _applyRewriteRules: function(obj) {
      if (obj == null) {
        obj = {};
      }
      return _.reduce([convertProjectsToArray, renameSessionToken], function(memo, fn) {
        var ret;
        if (ret = fn(memo)) {
          return ret;
        } else {
          return memo;
        }
      }, _.cloneDeep(obj));
    },
    read: function() {
      return fileUtil.get().then((function(_this) {
        return function(contents) {
          return _.defaults(contents, _this.defaults());
        };
      })(this));
    },
    write: function(obj) {
      if (obj == null) {
        obj = {};
      }
      logger.info("writing to .cy cache", {
        cache: obj
      });
      return fileUtil.set(obj)["return"](obj);
    },
    _getProjects: function(tx) {
      return tx.get("PROJECTS", []);
    },
    _removeProjects: function(tx, projects, paths) {
      projects = _.without.apply(_, [projects].concat(slice.call([].concat(paths))));
      return tx.set({
        PROJECTS: projects
      });
    },
    getProjectPaths: function() {
      return fileUtil.transaction((function(_this) {
        return function(tx) {
          return _this._getProjects(tx).then(function(projects) {
            var pathsToRemove;
            pathsToRemove = Promise.reduce(projects, function(memo, path) {
              return fs.statAsync(path)["catch"](function() {
                return memo.push(path);
              })["return"](memo);
            }, []);
            return pathsToRemove.then(function(removedPaths) {
              return _this._removeProjects(tx, projects, removedPaths);
            }).then(function() {
              return _this._getProjects(tx);
            });
          });
        };
      })(this));
    },
    removeProject: function(path) {
      return fileUtil.transaction((function(_this) {
        return function(tx) {
          return _this._getProjects(tx).then(function(projects) {
            return _this._removeProjects(tx, projects, path);
          });
        };
      })(this));
    },
    insertProject: function(path) {
      return fileUtil.transaction((function(_this) {
        return function(tx) {
          return _this._getProjects(tx).then(function(projects) {
            var existingIndex;
            existingIndex = _.findIndex(projects, function(project) {
              return project === path;
            });
            if (existingIndex > -1) {
              projects.splice(existingIndex, 1);
            }
            projects.unshift(path);
            return tx.set("PROJECTS", projects);
          });
        };
      })(this));
    },
    getUser: function() {
      logger.info("getting user");
      return fileUtil.get("USER", {});
    },
    setUser: function(user) {
      logger.info("setting user", {
        user: user
      });
      return fileUtil.set({
        USER: user
      });
    },
    removeUser: function() {
      return fileUtil.set({
        USER: {}
      });
    },
    remove: function() {
      return fileUtil.remove();
    },
    __get: fileUtil.get.bind(fileUtil),
    __removeSync: function() {
      fileUtil._cache = {};
      return fs.removeSync(this.path);
    }
  };

}).call(this);
