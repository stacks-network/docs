(function() {
  var addRequest, cache, connect, getCachedFamily, http, setCache;

  http = require("http");

  connect = require("./connect");

  cache = {};

  addRequest = http.Agent.prototype.addRequest;

  setCache = function(options, family) {
    return cache[options.host + ":" + options.port] = family;
  };

  getCachedFamily = function(options) {
    return cache[options.host + ":" + options.port];
  };

  http.Agent.prototype.addRequest = function(req, options) {
    var agent, family, makeRequest;
    agent = this;
    makeRequest = function() {
      return addRequest.call(agent, req, options);
    };
    if (family = getCachedFamily(options)) {
      options.family = family;
      return makeRequest();
    }
    return connect.getAddress(options.port, options.host).then(function(address) {
      setCache(options, address.family);
      return options.family = address.family;
    }).then(makeRequest)["catch"](makeRequest);
  };

}).call(this);
