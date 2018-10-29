(function() {
  var url;

  url = require("url");

  module.exports = function(urlStr) {
    var parsed;
    parsed = url.parse(urlStr);
    parsed.hash = null;
    parsed.search = null;
    parsed.query = null;
    parsed.path = null;
    parsed.pathname = null;
    return url.format(parsed);
  };

}).call(this);
