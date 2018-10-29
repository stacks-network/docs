(function() {
  var Promise, _;

  _ = require("lodash");

  Promise = require("bluebird");

  module.exports = function(options) {
    return Promise["try"](function() {
      return _.toNumber(options.exitWithCode);
    });
  };

}).call(this);
