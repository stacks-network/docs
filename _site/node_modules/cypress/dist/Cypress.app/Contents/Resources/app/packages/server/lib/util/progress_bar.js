(function() {
  var ProgressBar, _, chalk;

  _ = require("lodash");

  chalk = require("chalk");

  ProgressBar = require("progress");

  module.exports = {
    create: function(message, options) {
      var ascii, bar, clear, tick, tickTotal, ticked, total;
      if (options == null) {
        options = {};
      }
      _.defaults(options, {
        total: 100,
        width: 30
      });
      ascii = [chalk.white("  -"), chalk.blue(message), chalk.yellow("[:bar]"), chalk.white(":percent"), chalk.gray(":etas")];
      bar = new ProgressBar(ascii.join(" "), {
        total: options.total,
        width: options.width
      });
      ticked = 0;
      total = options.total;
      clear = function() {
        bar.clear = true;
        return bar.terminate();
      };
      tick = function(num) {
        ticked += num;
        return bar.tick(num);
      };
      tickTotal = function(float) {
        var abs, diff;
        abs = total * float;
        diff = abs - ticked;
        return tick(diff);
      };
      return {
        bar: bar,
        tick: tick,
        clear: clear,
        tickTotal: tickTotal
      };
    }
  };

}).call(this);
