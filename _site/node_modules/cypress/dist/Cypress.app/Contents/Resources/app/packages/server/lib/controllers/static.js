(function() {
  var send, staticPkg;

  send = require("send");

  staticPkg = require("@packages/static");

  module.exports = {
    handle: function(req, res) {
      var pathToFile;
      pathToFile = staticPkg.getPathToDist(req.params[0]);
      return send(req, pathToFile).pipe(res);
    }
  };

}).call(this);
