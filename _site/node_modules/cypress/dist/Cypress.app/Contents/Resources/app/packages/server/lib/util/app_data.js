(function() {
  var Promise, check, cwd, data, fs, getSymlinkType, isProduction, la, log, name, os, ospath, path, pkg,
    slice = [].slice;

  fs = require("fs-extra");

  path = require("path");

  ospath = require("ospath");

  Promise = require("bluebird");

  la = require("lazy-ass");

  check = require("check-more-types");

  log = require("debug")("cypress:server:appdata");

  pkg = require("@packages/root");

  cwd = require("../cwd");

  os = require("os");

  fs = Promise.promisifyAll(fs);

  name = pkg.productName || pkg.name;

  data = ospath.data();

  if (!name) {
    throw new Error("Root package is missing name");
  }

  getSymlinkType = function() {
    if (os.platform() === "win32") {
      return "junction";
    } else {
      return "dir";
    }
  };

  isProduction = function() {
    return process.env.CYPRESS_ENV === "production";
  };

  module.exports = {
    ensure: function() {
      var ensure;
      ensure = (function(_this) {
        return function() {
          return _this.removeSymlink().then(function() {
            return Promise.join(fs.ensureDirAsync(_this.path()), !isProduction() ? _this.symlink() : void 0);
          });
        };
      })(this);
      return ensure()["catch"](ensure);
    },
    symlink: function() {
      var dest, src, symlinkType;
      src = path.dirname(this.path());
      dest = cwd(".cy");
      log("symlink folder from %s to %s", src, dest);
      symlinkType = getSymlinkType();
      return fs.ensureSymlinkAsync(src, dest, symlinkType);
    },
    removeSymlink: function() {
      return fs.removeAsync(cwd(".cy"))["catch"](function() {});
    },
    path: function() {
      var p, paths;
      paths = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      la(check.unemptyString(process.env.CYPRESS_ENV), "expected CYPRESS_ENV, found", process.env.CYPRESS_ENV);
      p = path.join.apply(path, [data, name, "cy", process.env.CYPRESS_ENV].concat(slice.call(paths)));
      log("path: %s", p);
      return p;
    },
    projectsPath: function() {
      var paths;
      paths = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      return this.path.apply(this, ["projects"].concat(slice.call(paths)));
    },
    remove: function() {
      return Promise.join(fs.removeAsync(this.path()), this.removeSymlink());
    }
  };

}).call(this);
