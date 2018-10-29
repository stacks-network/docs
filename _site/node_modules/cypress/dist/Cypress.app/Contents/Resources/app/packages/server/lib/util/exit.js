(function() {
  var onExit;

  onExit = require("signal-exit");

  module.exports = {
    ensure: onExit
  };

}).call(this);
