(function() {
  var stream;

  stream = require("stream");

  module.exports = function(condition, dest) {
    if (condition) {
      return dest;
    }
    return stream.PassThrough();
  };

}).call(this);
