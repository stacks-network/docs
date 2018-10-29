(function() {
  var Promise, _, json;

  _ = require("lodash");

  Promise = require("bluebird");

  json = require("@packages/root");

  module.exports = function(options) {
    return Promise.resolve(_.extend({}, options, _.pick(json, "version")));
  };

}).call(this);
