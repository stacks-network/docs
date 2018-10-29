(function() {
  var KEYS, LENS, MAX, TRANSLATION, _, chalk;

  _ = require("lodash");

  chalk = require("chalk");

  TRANSLATION = {
    tests: "Tests",
    passes: "Passes",
    failures: "Failures",
    pending: "Pending",
    duration: "Duration",
    screenshots: "Screenshots",
    video: "Video Recorded",
    version: "Cypress Version"
  };

  KEYS = _.keys(TRANSLATION);

  LENS = _.map(TRANSLATION, function(val, key) {
    return val.length;
  });

  MAX = Math.max.apply(Math, LENS);

  module.exports = {
    format: function(color, val, key) {
      var word;
      word = "  - " + TRANSLATION[key] + ":";
      key = _.padEnd(word, MAX + 6);
      return chalk.white(key) + chalk[color](val);
    },
    display: function(color, stats) {
      if (stats == null) {
        stats = {};
      }
      stats = _.pick(stats, KEYS);
      return _.each(stats, (function(_this) {
        return function(val, key) {
          return console.log(_this.format(color, val, key));
        };
      })(this));
    }
  };

}).call(this);
