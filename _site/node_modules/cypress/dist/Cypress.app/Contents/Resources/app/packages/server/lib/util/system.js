(function() {
  var Promise, getOsVersion, getos, os;

  os = require("os");

  Promise = require("bluebird");

  getos = Promise.promisify(require("getos"));

  getOsVersion = function() {
    return Promise["try"](function() {
      if (os.platform() === "linux") {
        return getos().then(function(obj) {
          return [obj.dist, obj.release].join(" - ");
        })["catch"](function(err) {
          return os.release();
        });
      } else {
        return os.release();
      }
    });
  };

  module.exports = {
    info: function() {
      return getOsVersion().then(function(osVersion) {
        return {
          osName: os.platform(),
          osVersion: osVersion,
          osCpus: os.cpus(),
          osMemory: {
            free: os.freemem(),
            total: os.totalmem()
          }
        };
      });
    }
  };

}).call(this);
