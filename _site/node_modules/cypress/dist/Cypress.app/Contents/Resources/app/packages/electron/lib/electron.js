(function() {
  var Promise, cp, fs, install, log, minimist, path, paths;

  fs = require("fs-extra");

  cp = require("child_process");

  path = require("path");

  Promise = require("bluebird");

  minimist = require("minimist");

  paths = require("./paths");

  install = require("./install");

  log = require("debug")("cypress:electron");

  fs = Promise.promisifyAll(fs);

  module.exports = {
    installIfNeeded: function() {
      return install.check();
    },
    install: function() {
      log("installing %j", arguments);
      return install["package"].apply(install, arguments);
    },
    cli: function(argv) {
      var opts, pathToApp;
      if (argv == null) {
        argv = [];
      }
      opts = minimist(argv);
      log("cli options %j", opts);
      pathToApp = argv[0];
      switch (false) {
        case !opts.install:
          return this.installIfNeeded();
        case !pathToApp:
          return this.open(pathToApp, argv);
        default:
          throw new Error("No path to your app was provided.");
      }
    },
    open: function(appPath, argv, cb) {
      var dest;
      log("opening %s", appPath);
      appPath = path.resolve(appPath);
      dest = paths.getPathToResources("app");
      log("appPath %s", appPath);
      log("dest path %s", dest);
      return fs.statAsync(appPath).then(function() {
        log("appPath exists %s", appPath);
        return fs.removeAsync(dest);
      }).then(function() {
        var symlinkType;
        symlinkType = paths.getSymlinkType();
        log("making symlink from %s to %s of type %s", appPath, dest, symlinkType);
        return fs.ensureSymlinkAsync(appPath, dest, symlinkType);
      }).then(function() {
        var execPath;
        execPath = paths.getPathToExec();
        log("spawning %s", execPath);
        return cp.spawn(execPath, argv, {
          stdio: "inherit"
        }).on("close", function(code) {
          log("electron closing with code", code);
          if (code) {
            log("original command was");
            log(execPath, argv.join(" "));
          }
          if (cb) {
            log("calling callback with code", code);
            return cb(code);
          } else {
            log("process.exit with code", code);
            return process.exit(code);
          }
        });
      })["catch"](function(err) {
        console.log(err.stack);
        return process.exit(1);
      });
    }
  };

}).call(this);
