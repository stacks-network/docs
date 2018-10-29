(function() {
  var _, toBoolean;

  _ = require("lodash");

  toBoolean = require("underscore.string/toBoolean");

  module.exports = function(value) {
    var ref, ref1;
    switch (false) {
      case ((ref = _.toNumber(value)) != null ? ref.toString() : void 0) !== value:
        return _.toNumber(value);
      case ((ref1 = toBoolean(value)) != null ? ref1.toString() : void 0) !== value:
        return toBoolean(value);
      default:
        return value;
    }
  };

}).call(this);
