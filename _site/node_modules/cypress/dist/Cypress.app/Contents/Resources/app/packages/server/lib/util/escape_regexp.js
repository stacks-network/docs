(function() {
  var reSymbols;

  reSymbols = /[-\/\\^$*+?.()|[\]{}]/g;

  module.exports = function(str) {
    return str.replace(reSymbols, '\\$&');
  };

}).call(this);
