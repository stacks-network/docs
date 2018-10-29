(function() {
  var _, buffers, url;

  _ = require("lodash");

  url = require("url");

  buffers = [];

  module.exports = {
    all: function() {
      return buffers;
    },
    keys: function() {
      return _.map(buffers, "url");
    },
    reset: function() {
      return buffers = [];
    },
    set: function(obj) {
      if (obj == null) {
        obj = {};
      }
      return buffers.push(_.pick(obj, "url", "originalUrl", "jar", "stream", "response", "details"));
    },
    getByOriginalUrl: function(str) {
      return _.find(buffers, {
        originalUrl: str
      });
    },
    get: function(str) {
      var b, find, parsed;
      find = function(str) {
        return _.find(buffers, {
          url: str
        });
      };
      b = find(str);
      if (b) {
        return b;
      }
      parsed = url.parse(str);
      if (parsed.protocol === "https:" && parsed.port) {
        parsed.host = parsed.host.split(":")[0];
        parsed.port = null;
        return find(parsed.format());
      }
    },
    take: function(str) {
      var buffer;
      if (buffer = this.get(str)) {
        buffers = _.without(buffers, buffer);
      }
      return buffer;
    }
  };

}).call(this);
