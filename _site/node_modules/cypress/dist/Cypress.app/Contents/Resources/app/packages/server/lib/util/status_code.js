(function() {
  var isOkStatusCodeRe, statuses;

  statuses = require("http-status-codes");

  isOkStatusCodeRe = /^[2|3]\d+$/;

  module.exports = {
    isOk: function(code) {
      return code && isOkStatusCodeRe.test(code);
    },
    getText: function(code) {
      var e;
      try {
        return statuses.getStatusText(code);
      } catch (error) {
        e = error;
        return "Unknown Status Code";
      }
    }
  };

}).call(this);
