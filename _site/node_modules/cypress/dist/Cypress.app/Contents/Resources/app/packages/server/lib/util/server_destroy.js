(function() {
  var Promise, allowDestroy;

  Promise = require("bluebird");

  allowDestroy = require("server-destroy");

  module.exports = function(server) {
    allowDestroy(server);
    return server.destroyAsync = function() {
      return Promise.promisify(server.destroy)()["catch"](function() {});
    };
  };

}).call(this);
