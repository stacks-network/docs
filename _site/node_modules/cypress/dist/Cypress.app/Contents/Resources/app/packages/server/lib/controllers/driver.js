(function() {
  var driver, send;

  send = require("send");

  driver = require("@packages/driver");

  module.exports = {
    handle: function(req, res) {
      var pathToFile;
      pathToFile = driver.getPathToDist(req.params[0]);
      return send(req, pathToFile).pipe(res);
    }
  };

}).call(this);
