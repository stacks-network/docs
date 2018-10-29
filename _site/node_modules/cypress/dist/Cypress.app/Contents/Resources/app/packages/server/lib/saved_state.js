(function() {
  var FileUtil, appData, findSavedSate, log, savedStateUtil, stateFiles;

  FileUtil = require("./util/file");

  appData = require("./util/app_data");

  log = require('./log');

  savedStateUtil = require("./util/saved_state");

  stateFiles = {};

  findSavedSate = function(projectPath) {
    return savedStateUtil.formStatePath(projectPath).then(function(statePath) {
      var fullStatePath, stateFile;
      fullStatePath = appData.projectsPath(statePath);
      log('full state path %s', fullStatePath);
      if (stateFiles[fullStatePath]) {
        return stateFiles[fullStatePath];
      }
      log('making new state file around %s', fullStatePath);
      stateFile = new FileUtil({
        path: fullStatePath
      });
      stateFiles[fullStatePath] = stateFile;
      return stateFile;
    });
  };

  module.exports = findSavedSate;

}).call(this);
