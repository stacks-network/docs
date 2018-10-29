(function() {
  var Promise, dns, net, url;

  net = require("net");

  dns = require("dns");

  url = require("url");

  Promise = require("bluebird");

  module.exports = {
    byPortAndAddress: function(port, address) {
      return new Promise(function(resolve, reject) {
        var client;
        client = net.connect(port, address.address);
        client.on("connect", function() {
          client.end();
          return resolve(address);
        });
        return client.on("error", reject);
      });
    },
    getAddress: function(port, hostname) {
      var fn, lookupAsync;
      fn = this.byPortAndAddress.bind(this, port);
      lookupAsync = Promise.promisify(dns.lookup, {
        context: dns
      });
      return lookupAsync(hostname, {
        all: true
      }).then(function(addresses) {
        return [].concat(addresses).map(fn);
      }).any();
    },
    ensureUrl: function(urlStr) {
      var hostname, port, protocol, ref;
      ref = url.parse(urlStr), hostname = ref.hostname, protocol = ref.protocol, port = ref.port;
      if (port == null) {
        port = protocol === "https:" ? "443" : "80";
      }
      return this.getAddress(port, hostname);
    }
  };

}).call(this);
