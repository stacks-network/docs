(function() {
  var Promise, appData, fs, launcher, path, profiles;

  fs = require("fs-extra");

  path = require("path");

  Promise = require("bluebird");

  launcher = require("@packages/launcher");

  appData = require("../util/app_data");

  fs = Promise.promisifyAll(fs);

  profiles = appData.path("browsers");

  module.exports = {
    getProfileDir: function(name) {
      return path.join(profiles, name);
    },
    ensureCleanCache: function(name) {
      var p;
      p = path.join(profiles, name, "CypressCache");
      return fs.removeAsync(p).then(function() {
        return fs.ensureDirAsync(p);
      })["return"](p);
    },
    copyExtension: function(src, dest) {
      return fs.copyAsync(src, dest);
    },
    getBrowsers: function() {
      return launcher.detect().then(function(browsers) {
        var version;
        if (browsers == null) {
          browsers = [];
        }
        version = process.versions.chrome || "";
        return browsers.concat({
          name: "electron",
          displayName: "Electron",
          version: version,
          path: "",
          majorVersion: version.split(".")[0],
          info: "Electron is the default browser that comes with Cypress. This is the browser that runs in headless mode. Selecting this browser is useful when debugging. The version number indicates the underlying Chromium version that Electron uses."
        });
      });
    },
    launch: function(name, url, args) {
      return launcher().call("launch", name, url, args);
    }
  };

}).call(this);
