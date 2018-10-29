(function() {
  var DEFAULT_PORTS, _, matches, minimatch, stripProtocolAndDefaultPorts, url,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  _ = require("lodash");

  url = require("url");

  minimatch = require("minimatch");

  DEFAULT_PORTS = ["443", "80"];

  stripProtocolAndDefaultPorts = function(urlToCheck) {
    var host, hostname, port, ref;
    ref = url.parse(urlToCheck), host = ref.host, hostname = ref.hostname, port = ref.port;
    if (indexOf.call(DEFAULT_PORTS, port) >= 0) {
      return hostname;
    }
    return host;
  };

  matches = function(urlToCheck, blacklistHosts) {
    var matchUrl;
    blacklistHosts = [].concat(blacklistHosts);
    urlToCheck = stripProtocolAndDefaultPorts(urlToCheck);
    matchUrl = function(hostMatcher) {
      return minimatch(urlToCheck, hostMatcher);
    };
    return _.find(blacklistHosts, matchUrl);
  };

  module.exports = {
    matches: matches,
    stripProtocolAndDefaultPorts: stripProtocolAndDefaultPorts
  };

}).call(this);
