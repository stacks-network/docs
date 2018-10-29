(function() {
  var clientSource, clientVersion, socketIo;

  socketIo = require("@packages/socket");

  clientSource = socketIo.getClientSource();

  clientVersion = socketIo.getClientVersion();

  module.exports = {
    handle: function(req, res) {
      var etag;
      etag = req.get("if-none-match");
      if (etag && (etag === clientVersion)) {
        return res.sendStatus(304);
      } else {
        return res.type("application/javascript").set("ETag", clientVersion).status(200).send(clientSource);
      }
    }
  };

}).call(this);
