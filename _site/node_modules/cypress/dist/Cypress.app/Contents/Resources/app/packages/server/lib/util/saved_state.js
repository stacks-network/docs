(function() {
  var Promise, basename, cwd, formStatePath, fs, isAbsolute, join, log, md5, ref, sanitize, toHashName;

  log = require('../log');

  cwd = require('../cwd');

  fs = require('fs-extra');

  md5 = require('md5');

  sanitize = require("sanitize-filename");

  Promise = require("bluebird");

  ref = require('path'), basename = ref.basename, join = ref.join, isAbsolute = ref.isAbsolute;

  toHashName = function(projectPath) {
    var hash, name;
    if (!projectPath) {
      throw new Error("Missing project path");
    }
    if (!isAbsolute(projectPath)) {
      throw new Error("Expected project absolute path, not just a name " + projectPath);
    }
    name = sanitize(basename(projectPath));
    hash = md5(projectPath);
    return name + "-" + hash;
  };

  formStatePath = function(projectPath) {
    return Promise.resolve().then(function() {
      var cypressJsonPath;
      log('making saved state from %s', cwd());
      if (projectPath) {
        log('for project path %s', projectPath);
        return projectPath;
      } else {
        log('missing project path, looking for project here');
        cypressJsonPath = cwd('cypress.json');
        return fs.pathExists(cypressJsonPath).then(function(found) {
          if (found) {
            log('found cypress file %s', cypressJsonPath);
            projectPath = cwd();
          }
          return projectPath;
        });
      }
    }).then(function(projectPath) {
      var fileName, statePath;
      fileName = "state.json";
      if (projectPath) {
        log("state path for project " + projectPath);
        statePath = join(toHashName(projectPath), fileName);
      } else {
        log("state path for global mode");
        statePath = join("__global__", fileName);
      }
      return statePath;
    });
  };

  module.exports = {
    toHashName: toHashName,
    formStatePath: formStatePath
  };

}).call(this);
