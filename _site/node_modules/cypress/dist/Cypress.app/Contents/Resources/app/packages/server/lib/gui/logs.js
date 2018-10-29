(function() {
  var chalk, logger;

  chalk = require("chalk");

  logger = require("../logger");

  module.exports = {
    get: function() {
      return logger.getLogs();
    },
    clear: function() {
      return logger.clearLogs();
    },
    off: function() {
      return logger.off();
    },
    onLog: function(fn) {
      return logger.onLog(fn);
    },
    error: function(err) {
      return logger.createException(err)["catch"](function() {});
    },
    print: function() {
      return this.get().then(function(logs) {
        return logs.forEach(function(log, i) {
          var color, str;
          str = JSON.stringify(log);
          color = i % 2 === 0 ? "cyan" : "yellow";
          return console.log(chalk[color](str));
        });
      });
    }
  };

}).call(this);
