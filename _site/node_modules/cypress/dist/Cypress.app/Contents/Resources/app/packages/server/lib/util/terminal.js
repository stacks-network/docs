(function() {
  var _, chalk;

  _ = require("lodash");

  chalk = require("chalk");

  module.exports = {
    header: function(message, options) {
      var c, colors;
      if (options == null) {
        options = {};
      }
      _.defaults(options, {
        color: null
      });
      message = "  (" + chalk.underline.bold(message) + ")";
      if (c = options.color) {
        colors = [].concat(c);
        message = _.reduce(colors, function(memo, color) {
          return chalk[color](memo);
        }, message);
      }
      return console.log(message);
    },
    divider: function(message, options) {
      var a, c, w;
      if (options == null) {
        options = {};
      }
      _.defaults(options, {
        width: 100,
        preBreak: false,
        postBreak: false
      });
      w = options.width / 2;
      a = function() {
        return Array(Math.floor(w));
      };
      message = " " + message + " ";
      message = a().concat(message, a()).join("=");
      if (c = options.color) {
        message = chalk[c](message);
      }
      if (options.preBreak) {
        console.log("");
      }
      console.log(message);
      if (options.postBreak) {
        return console.log("");
      }
    }
  };

}).call(this);
