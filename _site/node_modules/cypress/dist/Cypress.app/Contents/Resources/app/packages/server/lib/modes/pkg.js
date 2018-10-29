(function() {
  var Promise, pkg;

  Promise = require("bluebird");

  pkg = require("@packages/root");

  module.exports = function() {
    return Promise.resolve(pkg);
  };

}).call(this);
