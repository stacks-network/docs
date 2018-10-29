(function() {
  var Promise, _, cp, exit, exit0, exitErr, log, path;

  require("./environment");

  _ = require("lodash");

  cp = require("child_process");

  path = require("path");

  Promise = require("bluebird");

  log = require('./log');

  exit = function(code) {
    if (code == null) {
      code = 0;
    }
    log("about to exit with code", code);
    return process.exit(code);
  };

  exit0 = function() {
    return exit(0);
  };

  exitErr = function(err) {
    log('exiting with err', err);
    return require("./errors").log(err).then(function() {
      return exit(1);
    });
  };

  module.exports = {
    isCurrentlyRunningElectron: function() {
      return !!(process.versions && process.versions.electron);
    },
    runElectron: function(mode, options) {
      return Promise["try"]((function(_this) {
        return function() {
          if (_this.isCurrentlyRunningElectron()) {
            return require("./modes")(mode, options);
          } else {
            return new Promise(function(resolve) {
              var cypressElectron, fn;
              cypressElectron = require("@packages/electron");
              fn = function(code) {
                log("electron finished with", code);
                return resolve({
                  failures: code
                });
              };
              return cypressElectron.open(".", require("./util/args").toArray(options), fn);
            });
          }
        };
      })(this));
    },
    openProject: function(options) {
      return require("./open_project").open(options.project, options);
    },
    runServer: function(options) {},
    start: function(argv) {
      if (argv == null) {
        argv = [];
      }
      require("./logger").info("starting desktop app", {
        args: argv
      });
      log("starting cypress server");
      return require("./util/app_data").ensure().then((function(_this) {
        return function() {
          var mode, options;
          options = require("./util/args").toObject(argv);
          switch (false) {
            case !options.removeIds:
              options.mode = "removeIds";
              break;
            case !options.version:
              options.mode = "version";
              break;
            case !options.smokeTest:
              options.mode = "smokeTest";
              break;
            case !options.returnPkg:
              options.mode = "returnPkg";
              break;
            case !options.logs:
              options.mode = "logs";
              break;
            case !options.clearLogs:
              options.mode = "clearLogs";
              break;
            case !options.getKey:
              options.mode = "getKey";
              break;
            case !options.generateKey:
              options.mode = "generateKey";
              break;
            case options.exitWithCode == null:
              options.mode = "exitWithCode";
              break;
            case !(options.record || options.ci):
              options.mode = "record";
              break;
            case !options.runProject:
              options.mode = "headless";
              break;
            default:
              if (options.mode == null) {
                options.mode = "headed";
              }
          }
          mode = options.mode;
          options = _.omit(options, "mode");
          if (_.isArray(options.spec)) {
            options.spec = options.spec[0];
          }
          return _this.startInMode(mode, options);
        };
      })(this));
    },
    startInMode: function(mode, options) {
      log("start in mode %s with options %j", mode, options);
      switch (mode) {
        case "removeIds":
          return require("./project").removeIds(options.projectPath).then(function(stats) {
            if (stats == null) {
              stats = {};
            }
            return console.log("Removed '" + stats.ids + "' ids from '" + stats.files + "' files.");
          }).then(exit0)["catch"](exitErr);
        case "version":
          return require("./modes/pkg")(options).get("version").then(function(version) {
            return console.log(version);
          }).then(exit0)["catch"](exitErr);
        case "smokeTest":
          return require("./modes/smoke_test")(options).then(function(pong) {
            return console.log(pong);
          }).then(exit0)["catch"](exitErr);
        case "returnPkg":
          return require("./modes/pkg")(options).then(function(pkg) {
            return console.log(JSON.stringify(pkg));
          }).then(exit0)["catch"](exitErr);
        case "logs":
          return require("./gui/logs").print().then(exit0)["catch"](exitErr);
        case "clearLogs":
          return require("./gui/logs").clear().then(exit0)["catch"](exitErr);
        case "getKey":
          return require("./project").getSecretKeyByPath(options.projectPath).then(function(key) {
            return console.log(key);
          }).then(exit0)["catch"](exitErr);
        case "generateKey":
          return require("./project").generateSecretKeyByPath(options.projectPath).then(function(key) {
            return console.log(key);
          }).then(exit0)["catch"](exitErr);
        case "exitWithCode":
          return require("./modes/exit")(options).then(exit)["catch"](exitErr);
        case "headless":
          return this.runElectron(mode, options).get("failures").then(exit)["catch"](exitErr);
        case "headed":
          return this.runElectron(mode, options);
        case "record":
          return this.runElectron(mode, options).get("failures").then(exit)["catch"](exitErr);
        case "server":
          return this.runServer(options);
        case "openProject":
          return this.openProject(options);
        default:
          throw new Error("Cannot start. Invalid mode: '" + mode + "'");
      }
    }
  };

}).call(this);
