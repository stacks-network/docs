(function() {
  var NwUpdater, Updater, _, cwd, debug, fs, konfig, linuxAppRe, localCwd, nmi, osxAppRe, pkg, request, semver,
    slice = [].slice;

  _ = require("lodash");

  fs = require("fs-extra");

  nmi = require("node-machine-id");

  debug = require("debug")("cypress:server:updater");

  semver = require("semver");

  request = require("request");

  NwUpdater = require("node-webkit-updater");

  pkg = require("@packages/root");

  cwd = require("./cwd");

  konfig = require("./konfig");

  localCwd = cwd();

  osxAppRe = /\.app$/;

  linuxAppRe = /Cypress$/i;

  NwUpdater.prototype.checkNewVersion = function(cb) {
    var gotManifest, sendReq;
    gotManifest = function(err, req, data) {
      var e, newVersion;
      if (err) {
        return cb(err);
      }
      if (req.statusCode < 200 || req.statusCode > 299) {
        return cb(new Error(req.statusCode));
      }
      try {
        data = JSON.parse(data);
      } catch (error) {
        e = error;
        return cb(e);
      }
      try {
        newVersion = semver.gt(data.version, this.manifest.version);
      } catch (error) {
        e = error;
        newVersion = false;
      }
      return cb(null, newVersion, data);
    };
    sendReq = (function(_this) {
      return function(id) {
        return request.get({
          url: _this.manifest.manifestUrl,
          headers: {
            "x-cypress-version": pkg.version,
            "x-machine-id": id
          }
        }, gotManifest.bind(_this));
      };
    })(this);
    return nmi.machineId().then(sendReq)["catch"](function() {
      return sendReq(null);
    });
  };

  Updater = (function() {
    function Updater(callbacks) {
      if (!(this instanceof Updater)) {
        return new Updater(callbacks);
      }
      this.client = new NwUpdater(this.getPackage());
      this.request = null;
      this.callbacks = callbacks;
      if (process.env["CYPRESS_ENV"] !== "production") {
        this.patchAppPath();
      }
    }

    Updater.prototype.patchAppPath = function() {
      return this.getClient().getAppPath = function() {
        return cwd();
      };
    };

    Updater.prototype.getPackage = function() {
      return _.extend({}, pkg, {
        manifestUrl: konfig("desktop_manifest_url")
      });
    };

    Updater.prototype.getClient = function() {
      var ref;
      return (function() {
        if ((ref = this.client) != null) {
          return ref;
        } else {
          throw new Error("missing Updater#client");
        }
      }).call(this);
    };

    Updater.prototype.trigger = function() {
      var args, cb, event;
      event = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
      event = "on" + event[0].toUpperCase() + event.slice(1);
      if (cb = this.callbacks && this.callbacks[event]) {
        return cb.apply(this, args);
      }
    };

    Updater.prototype.check = function(options) {
      if (options == null) {
        options = {};
      }
      debug("checking for new version of Cypress. current version is", pkg.version);
      return this.getClient().checkNewVersion((function(_this) {
        return function(err, newVersionExists, manifest) {
          if (err) {
            return _this.trigger("error", err);
          }
          if (manifest) {
            debug("latest version of Cypress is:", manifest.version);
          }
          if (newVersionExists) {
            debug("new version of Cypress exists:", manifest.version);
            return typeof options.onNewVersion === "function" ? options.onNewVersion(manifest) : void 0;
          } else {
            debug("new version of Cypress does not exist");
            return typeof options.onNoNewVersion === "function" ? options.onNoNewVersion() : void 0;
          }
        };
      })(this));
    };

    Updater.check = function(options) {
      if (options == null) {
        options = {};
      }
      return Updater().check(options);
    };

    return Updater;

  })();

  module.exports = Updater;

}).call(this);
