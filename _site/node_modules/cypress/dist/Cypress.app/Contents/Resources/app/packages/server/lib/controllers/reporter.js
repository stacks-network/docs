(function() {
  var _, reporter, send;

  _ = require("lodash");

  send = require("send");

  reporter = require("@packages/reporter");

  module.exports = {
    handle: function(req, res) {
      var pathToFile;
      pathToFile = reporter.getPathToDist(req.params[0]);
      return send(req, pathToFile).pipe(res);
    }
  };

}).call(this);
