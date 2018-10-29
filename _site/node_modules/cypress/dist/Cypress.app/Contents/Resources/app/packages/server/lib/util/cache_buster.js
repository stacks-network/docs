(function() {
  var DIGITS, SEPERATOR, _;

  _ = require('lodash');

  DIGITS = 3;

  SEPERATOR = "-";

  module.exports = {
    get: function() {
      return SEPERATOR + Math.random().toFixed(DIGITS).slice(2, 5);
    },
    strip: function(str) {
      if (this._hasCacheBuster(str)) {
        return str.slice(0, -4);
      } else {
        return str;
      }
    },
    _hasCacheBuster: function(str) {
      return str.split("").slice(-4, -3).join("") === SEPERATOR;
    }
  };

}).call(this);
