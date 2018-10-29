(function() {
  var url;

  url = require("url");

  module.exports = {
    parseHost: function(hostString, defaultPort) {
      var host, hostPort, m, parsedUrl, port;
      if (m = hostString.match(/^http:\/\/(.*)/)) {
        parsedUrl = url.parse(hostString);
        return {
          host: parsedUrl.hostname,
          port: parsedUrl.port
        };
      }
      hostPort = hostString.split(':');
      host = hostPort[0];
      port = hostPort.length === 2 ? +hostPort[1] : defaultPort;
      return {
        host: host,
        port: port
      };
    },
    hostAndPort: function(reqUrl, headers, defaultPort) {
      var host, hostPort, m, parsedUrl;
      host = headers.host;
      hostPort = this.parseHost(host, defaultPort);
      if (m = reqUrl.match(/^http:\/\/([^\/]*)\/?(.*)$/)) {
        parsedUrl = url.parse(reqUrl);
        hostPort.host = parsedUrl.hostname;
        hostPort.port = parsedUrl.port;
        reqUrl = parsedUrl.path;
      }
      return hostPort;
    }
  };

}).call(this);
