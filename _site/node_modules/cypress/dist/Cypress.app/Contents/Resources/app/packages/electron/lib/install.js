(function() {
  var Promise, _, electronVersion, fs, log, os, path, paths, pkg;

  _ = require("lodash");

  os = require("os");

  fs = require("fs-extra");

  path = require("path");

  Promise = require("bluebird");

  pkg = require("../package.json");

  paths = require("./paths");

  log = require("debug")("cypress:electron");

  fs = Promise.promisifyAll(fs);

  if (!(electronVersion = pkg.electronVersion)) {
    throw new Error("Missing 'electronVersion' in ./package.json");
  }

  module.exports = {
    checkCurrentVersion: function() {
      var pathToVersion;
      pathToVersion = paths.getPathToVersion();
      return fs.readFileAsync(pathToVersion, "utf8").then(function(str) {
        var version;
        version = str.replace("v", "");
        if (version !== electronVersion) {
          throw new Error("Currently installed version: '" + version + "' does not match electronVersion: '" + electronVersion);
        } else {
          return process.exit();
        }
      });
    },
    checkExecExistence: function() {
      return fs.statAsync(paths.getPathToExec());
    },
    move: function(src, dest) {
      return fs.moveAsync(src, dest, {
        clobber: true
      }).then(function() {
        return fs.removeAsync(path.dirname(src));
      });
    },
    removeEmptyApp: function() {
      return fs.removeAsync(paths.getPathToResources("app"));
    },
    packageAndExit: function() {
      return this["package"]().then((function(_this) {
        return function() {
          return _this.removeEmptyApp();
        };
      })(this)).then(function() {
        return process.exit();
      });
    },
    "package": function(options) {
      var iconPath, icons, pkgr;
      if (options == null) {
        options = {};
      }
      pkgr = require("electron-packager");
      icons = require("@cypress/icons");
      iconPath = icons.getPathToIcon("cypress");
      log("package icon", iconPath);
      _.defaults(options, {
        dist: paths.getPathToDist(),
        dir: "app",
        out: "tmp",
        name: "Cypress",
        platform: os.platform(),
        arch: "x64",
        asar: false,
        prune: true,
        overwrite: true,
        electronVersion: electronVersion,
        icon: iconPath
      });
      log("packager options %j", options);
      return pkgr(options).then(function(appPaths) {
        return appPaths[0];
      }).then((function(_this) {
        return function(appPath) {
          console.log("moving created file from", appPath);
          console.log("to", options.dist);
          return _this.move(appPath, options.dist);
        };
      })(this))["catch"](function(err) {
        console.log(err.stack);
        return process.exit(1);
      });
    },
    ensure: function() {
      return Promise.join(this.checkCurrentVersion(), this.checkExecExistence());
    },
    check: function() {
      return this.ensure().bind(this)["catch"](this.packageAndExit);
    }
  };

}).call(this);
