(function() {
  var _, debug, ipAddressRe, parseDomain, url;

  _ = require("lodash");

  url = require("url");

  debug = require("debug")("cypress:server:cors");

  parseDomain = require("parse-domain");

  ipAddressRe = /^[\d\.]+$/;

  module.exports = {
    parseUrlIntoDomainTldPort: function(str) {
      var hostname, obj, parsed, port, protocol, ref, ref1, ref2, segments;
      ref = url.parse(str), hostname = ref.hostname, port = ref.port, protocol = ref.protocol;
      if (port == null) {
        port = protocol === "https:" ? "443" : "80";
      }
      if (!(parsed = parseDomain(hostname, {
        privateTlds: true,
        customTlds: ipAddressRe
      }))) {
        segments = hostname.split(".");
        parsed = {
          tld: (ref1 = segments[segments.length - 1]) != null ? ref1 : "",
          domain: (ref2 = segments[segments.length - 2]) != null ? ref2 : ""
        };
      }
      obj = {};
      obj.port = port;
      obj.tld = parsed.tld;
      obj.domain = parsed.domain;
      debug("Parsed URL %o", obj);
      return obj;
    },
    urlMatchesOriginPolicyProps: function(url, props) {
      var parsedUrl;
      if (!props) {
        return false;
      }
      parsedUrl = this.parseUrlIntoDomainTldPort(url);
      return _.isEqual(parsedUrl, props);
    }
  };

}).call(this);
