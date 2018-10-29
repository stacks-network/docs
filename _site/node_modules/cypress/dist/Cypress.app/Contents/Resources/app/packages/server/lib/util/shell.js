(function() {
  var Promise, R, execa, findBash, getProfilePath, getShell, isWindows, log, os, profiles, reset, sourceShellCommand, sourcedProfiles, startedNormally;

  Promise = require("bluebird");

  execa = require("execa");

  R = require("ramda");

  os = require("os");

  log = require("../log");

  isWindows = function() {
    return os.platform() === "win32";
  };

  profiles = {
    "~/.profile": /\/sh$/,
    "~/.bash_profile": /\/bash$/,
    "~/.cshrc": /\/csh$/,
    "~/.profile": /\/ksh$/,
    "~/.zshrc": /\/zsh$/,
    "~/.config/fish/config.fish": /\/fish$/
  };

  sourcedProfiles = [];

  startedNormally = function() {
    return Boolean(process.env._);
  };

  getProfilePath = function(shellPath) {
    var profilePath, regex;
    for (profilePath in profiles) {
      regex = profiles[profilePath];
      if (regex.test(shellPath)) {
        return profilePath;
      }
    }
  };

  sourceShellCommand = function(cmd, shell) {
    var haveShell, profilePath;
    if (!shell) {
      return cmd;
    }
    profilePath = getProfilePath(shell);
    log("shell %s profile %s", shell, profilePath);
    if (sourcedProfiles.includes(profilePath)) {
      log("profile has already been sourced");
      return cmd;
    } else {
      haveShell = startedNormally();
      if (haveShell) {
        sourcedProfiles.push(profilePath);
      }
      return "source " + profilePath + " > /dev/null 2>&1; " + cmd;
    }
  };

  findBash = function() {
    return execa.shell("which bash").then(R.prop("stdout"));
  };

  getShell = function(shell) {
    var s;
    if (shell) {
      return Promise.resolve(shell);
    }
    if (s = process.env.SHELL) {
      return Promise.resolve(s);
    }
    if (isWindows()) {
      log("use default shell on Windows");
      return Promise.resolve();
    }
    return findBash();
  };

  reset = function() {
    return sourcedProfiles = [];
  };

  module.exports = {
    reset: reset,
    findBash: findBash,
    getShell: getShell,
    getProfilePath: getProfilePath,
    sourceShellCommand: sourceShellCommand,
    startedNormally: startedNormally
  };

}).call(this);
