(function() {
  var Promise, _, fixture, fixturesRe, htmlLikeRe, isValidJSON, mime, str;

  _ = require("lodash");

  mime = require("mime");

  str = require("string-to-stream");

  Promise = require("bluebird");

  fixture = require("../fixture");

  fixturesRe = /^(fx:|fixture:)/;

  htmlLikeRe = /<.+>[\s\S]+<\/.+>/;

  isValidJSON = function(text) {
    var o;
    if (_.isObject(text)) {
      return true;
    }
    try {
      o = JSON.parse(text);
      return _.isObject(o);
    } catch (error) {
      false;
    }
    return false;
  };

  module.exports = {
    handle: function(req, res, config, next) {
      var delay, get, headers, respond, response, status;
      get = function(val, def) {
        var ref;
        return decodeURI((ref = req.get(val)) != null ? ref : def);
      };
      delay = ~~get("x-cypress-delay");
      status = get("x-cypress-status", 200);
      headers = get("x-cypress-headers", null);
      response = get("x-cypress-response", "");
      respond = (function(_this) {
        return function() {
          return _this.getResponse(response, config).then(function(resp) {
            var chunk, data, encoding;
            if (resp == null) {
              resp = {};
            }
            data = resp.data, encoding = resp.encoding;
            headers = _this.parseHeaders(headers, data);
            if (encoding == null) {
              encoding = "utf8";
            }
            if (_.isObject(data)) {
              data = JSON.stringify(data);
            }
            chunk = new Buffer(data, encoding);
            headers["content-length"] = chunk.length;
            return res.set(headers).status(status).end(chunk);
          })["catch"](function(err) {
            return res.status(400).send({
              __error: err.stack
            });
          });
        };
      })(this);
      if (delay > 0) {
        return Promise.delay(delay).then(respond);
      } else {
        return respond();
      }
    },
    _get: function(resp, config) {
      var encoding, file, filePath, options, ref;
      options = {};
      file = resp.replace(fixturesRe, "");
      ref = file.split(","), filePath = ref[0], encoding = ref[1];
      if (encoding) {
        options.encoding = encoding;
      }
      return fixture.get(config.fixturesFolder, filePath, options).then(function(bytes) {
        return {
          data: bytes,
          encoding: encoding
        };
      });
    },
    getStream: function(resp) {
      if (fixturesRe.test(resp)) {
        return this._get(resp).then(function(contents) {
          return str(contents);
        });
      } else {
        return str(resp);
      }
    },
    getResponse: function(resp, config) {
      if (fixturesRe.test(resp)) {
        return this._get(resp, config);
      } else {
        return Promise.resolve({
          data: resp
        });
      }
    },
    parseContentType: function(response) {
      var ret;
      ret = function(type) {
        return mime.lookup(type);
      };
      switch (false) {
        case !isValidJSON(response):
          return ret("json");
        case !htmlLikeRe.test(response):
          return ret("html");
        default:
          return ret("text");
      }
    },
    parseHeaders: function(headers, response) {
      try {
        headers = JSON.parse(headers);
      } catch (error) {}
      if (headers == null) {
        headers = {};
      }
      if (headers["content-type"] == null) {
        headers["content-type"] = this.parseContentType(response);
      }
      return headers;
    }
  };

}).call(this);
