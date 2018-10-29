(function() {
  var _log, _write;

  _write = process.stdout.write;

  _log = process.log;

  module.exports = {
    capture: function() {
      var log, logs, write;
      logs = [];
      write = process.stdout.write;
      log = process.log;
      if (log) {
        process.log = function(str) {
          logs.push(str);
          return log.apply(this, arguments);
        };
      }
      process.stdout.write = function(str) {
        logs.push(str);
        return write.apply(this, arguments);
      };
      return {
        toString: function() {
          return logs.join("");
        },
        data: logs
      };
    },
    restore: function() {
      process.stdout.write = _write;
      return process.log = _log;
    }
  };

}).call(this);
