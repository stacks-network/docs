(function() {
  var distPath, execPath, normalize, os, path, resourcesPath, unknownPlatformErr,
    slice = [].slice;

  os = require("os");

  path = require("path");

  distPath = "dist/Cypress";

  execPath = {
    darwin: "Cypress.app/Contents/MacOS/Cypress",
    freebsd: "Cypress",
    linux: "Cypress",
    win32: "Cypress.exe"
  };

  resourcesPath = {
    darwin: "Cypress.app/Contents/Resources",
    freebsd: "resources",
    linux: "resources",
    win32: "resources"
  };

  unknownPlatformErr = function() {
    throw new Error("Unknown platform: '" + (os.platform()) + "'");
  };

  normalize = function() {
    var paths;
    paths = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    return path.join.apply(path, [__dirname, ".."].concat(slice.call(paths)));
  };

  module.exports = {
    getPathToDist: function() {
      var paths;
      paths = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      paths = [distPath].concat(paths);
      return normalize.apply(null, paths);
    },
    getPathToExec: function() {
      var p, ref;
      p = (ref = execPath[os.platform()]) != null ? ref : unknownPlatformErr();
      return this.getPathToDist(p);
    },
    getPathToResources: function() {
      var p, paths, ref;
      paths = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      p = (ref = resourcesPath[os.platform()]) != null ? ref : unknownPlatformErr();
      p = [].concat(p, paths);
      return this.getPathToDist.apply(this, p);
    },
    getPathToVersion: function() {
      return this.getPathToDist("version");
    },
    getSymlinkType: function() {
      if (os.platform() === "win32") {
        return "junction";
      } else {
        return "dir";
      }
    }
  };

}).call(this);
