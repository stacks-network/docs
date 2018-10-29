(function() {
  var Promise, Settings, _, api, fileNameRe, fs, pathRe, pkg, stripPath, system, user, winston;

  _ = require("lodash");

  Promise = require("bluebird");

  winston = require("winston");

  fs = require("fs-extra");

  pkg = require("@packages/root");

  api = require("./api");

  user = require("./user");

  Settings = require("./util/settings");

  system = require("./util/system");

  pathRe = /'?((\/|\\|[a-z]:\\)[^\s']+)+'?/ig;

  fileNameRe = /[^\s'\/]+\.\w+:?\d*$/i;

  stripPath = function(text) {
    return (text || "").replace(pathRe, function(path) {
      var fileName;
      fileName = _.last(path.split("/")) || "";
      return "<stripped-path>" + fileName;
    });
  };

  module.exports = {
    getErr: function(err) {
      return {
        name: stripPath(err.name),
        message: stripPath(err.message),
        stack: stripPath(err.stack)
      };
    },
    getVersion: function() {
      return pkg.version;
    },
    getBody: function(err) {
      return system.info().then((function(_this) {
        return function(systemInfo) {
          return _.extend({
            err: _this.getErr(err),
            version: _this.getVersion()
          }, systemInfo);
        };
      })(this));
    },
    getAuthToken: function() {
      return user.get().then(function(user) {
        return user && user.authToken;
      });
    },
    create: function(err) {
      if (process.env["CYPRESS_ENV"] !== "production") {
        return Promise.resolve();
      }
      return Promise.join(this.getBody(err), this.getAuthToken()).spread(function(body, authToken) {
        return api.createRaygunException(body, authToken);
      });
    }
  };

}).call(this);
