(function() {
  var Promise, checkIfResolveChangedRootFolder, fs, getRealFolderPath, isIntegrationTestRe, isUnitTestRe, path;

  fs = require("fs");

  path = require("path");

  Promise = require("bluebird");

  fs = Promise.promisifyAll(fs);

  isIntegrationTestRe = /^integration/;

  isUnitTestRe = /^unit/;

  checkIfResolveChangedRootFolder = function(resolved, initial) {
    return path.isAbsolute(resolved) && path.isAbsolute(initial) && !resolved.startsWith(initial);
  };

  getRealFolderPath = function(folder) {
    if (!folder) {
      throw new Error("Expected folder");
    }
    return fs.realpathAsync(folder);
  };

  module.exports = {
    checkIfResolveChangedRootFolder: checkIfResolveChangedRootFolder,
    getRealFolderPath: getRealFolderPath,
    getAbsolutePathToSpec: function(spec, config) {
      switch (false) {
        case !isIntegrationTestRe.test(spec):
          spec = path.relative("integration", spec);
          return spec = path.join(config.integrationFolder, spec);
        default:
          return spec;
      }
    }
  };

}).call(this);
