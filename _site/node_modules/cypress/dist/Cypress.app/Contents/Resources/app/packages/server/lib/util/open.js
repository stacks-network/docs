(function() {
  var opn, os;

  os = require("os");

  opn = require("opn");

  module.exports = {
    opn: function(arg, opts) {
      if (opts == null) {
        opts = {};
      }
      if (os.platform() === "darwin") {
        opts.args = "-R";
      }
      return opn(arg, opts);
    }
  };

}).call(this);
