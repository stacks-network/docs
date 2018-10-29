(function() {
  var Cookie, CookieJar, Cookies, Promise, _, convertToJarCookie, createCookieString, getOriginalHeaders, moment, newCookieJar, pick, r, reduceCookieToArray, rp, setCookies, statusCode, tough, url;

  _ = require("lodash");

  r = require("request");

  rp = require("request-promise");

  url = require("url");

  tough = require("tough-cookie");

  moment = require("moment");

  Promise = require("bluebird");

  statusCode = require("./util/status_code");

  Cookies = require("./automation/cookies");

  Cookie = tough.Cookie;

  CookieJar = tough.CookieJar;

  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

  getOriginalHeaders = function(req) {
    var ref, ref1;
    if (req == null) {
      req = {};
    }
    return (ref = (ref1 = req.req) != null ? ref1.headers : void 0) != null ? ref : req.headers;
  };

  pick = function(resp) {
    var headers, ref, ref1, ref2, req;
    if (resp == null) {
      resp = {};
    }
    req = (ref = resp.request) != null ? ref : {};
    headers = getOriginalHeaders(req);
    return {
      "Request Body": (ref1 = req.body) != null ? ref1 : null,
      "Request Headers": headers,
      "Request URL": req.href,
      "Response Body": (ref2 = resp.body) != null ? ref2 : null,
      "Response Headers": resp.headers,
      "Response Status": resp.statusCode
    };
  };

  setCookies = (function(_this) {
    return function(cookies, jar, headers, url) {
      if (_.isEmpty(cookies)) {
        return;
      }
      if (jar) {
        return cookies.forEach(function(c) {
          return jar.setCookie(c, url, {
            ignoreError: true
          });
        });
      } else {
        return headers.Cookie = createCookieString(cookies);
      }
    };
  })(this);

  newCookieJar = function() {
    var j;
    j = new CookieJar(void 0, {
      looseMode: true
    });
    return {
      _jar: j,
      toJSON: function() {
        return j.toJSON();
      },
      setCookie: function(cookieOrStr, uri, options) {
        return j.setCookieSync(cookieOrStr, uri, options);
      },
      getCookieString: function(uri) {
        return j.getCookieStringSync(uri, {
          expire: false
        });
      },
      getCookies: function(uri) {
        return j.getCookiesSync(uri, {
          expire: false
        });
      }
    };
  };

  convertToJarCookie = function(cookies) {
    if (cookies == null) {
      cookies = [];
    }
    return _.map(cookies, function(cookie) {
      var props;
      props = {
        key: cookie.name,
        path: cookie.path,
        value: cookie.value,
        secure: cookie.secure,
        httpOnly: cookie.httpOnly,
        hostOnly: cookie.hostOnly
      };
      if (!cookie.hostOnly) {
        props.domain = _.trimStart(cookie.domain, ".");
      }
      if (cookie.expiry != null) {
        props.expires = moment.unix(cookie.expiry).toDate();
      }
      return new Cookie(props);
    });
  };

  reduceCookieToArray = function(c) {
    return _.reduce(c, function(memo, val, key) {
      memo.push([key.trim(), val.trim()].join("="));
      return memo;
    }, []);
  };

  createCookieString = function(c) {
    return reduceCookieToArray(c).join("; ");
  };

  module.exports = function(options) {
    var defaults, ref;
    if (options == null) {
      options = {};
    }
    defaults = {
      timeout: (ref = options.timeout) != null ? ref : 20000
    };
    r = r.defaults(defaults);
    rp = rp.defaults(defaults);
    return {
      r: require("request"),
      rp: require("request-promise"),
      reduceCookieToArray: reduceCookieToArray,
      createCookieString: createCookieString,
      create: function(strOrOpts, promise) {
        var opts, p;
        switch (false) {
          case !_.isString(strOrOpts):
            opts = {
              url: strOrOpts
            };
            break;
          default:
            opts = strOrOpts;
        }
        opts.url = url.parse(opts.url);
        if (p = opts.url.port) {
          opts.url.port = _.toNumber(p);
        }
        if (promise) {
          return rp(opts);
        } else {
          return r(opts);
        }
      },
      contentTypeIsJson: function(response) {
        var ref1, ref2;
        return response != null ? (ref1 = response.headers) != null ? (ref2 = ref1["content-type"]) != null ? ref2.includes("application/json") : void 0 : void 0 : void 0;
      },
      parseJsonBody: function(body) {
        var e;
        try {
          return JSON.parse(body);
        } catch (error) {
          e = error;
          return body;
        }
      },
      normalizeResponse: function(push, response) {
        var ref1, req;
        req = (ref1 = response.request) != null ? ref1 : {};
        push(response);
        response = _.pick(response, "statusCode", "body", "headers");
        response.status = response.statusCode;
        delete response.statusCode;
        _.extend(response, {
          statusText: statusCode.getText(response.status),
          isOkStatusCode: statusCode.isOk(response.status),
          requestHeaders: getOriginalHeaders(req),
          requestBody: req.body
        });
        if (_.isString(response.body) && this.contentTypeIsJson(response)) {
          response.body = this.parseJsonBody(response.body);
        }
        return response;
      },
      setJarCookies: function(jar, automationFn) {
        var setCookie;
        setCookie = function(cookie) {
          var ex;
          cookie.name = cookie.key;
          if (cookie.name && cookie.name.startsWith("__cypress")) {
            return;
          }
          switch (false) {
            case cookie.maxAge == null:
              cookie.expiry = moment().unix() + cookie.maxAge;
              break;
            case !(ex = cookie.expires):
              cookie.expiry = moment(ex).unix();
          }
          return automationFn("set:cookie", cookie).then(function() {
            return Cookies.normalizeCookieProps(cookie);
          });
        };
        return Promise["try"](function() {
          var store;
          store = jar.toJSON();
          return Promise.each(store.cookies, setCookie);
        });
      },
      sendStream: function(headers, automationFn, options) {
        var followRedirect, jar, self, send, ua;
        if (options == null) {
          options = {};
        }
        _.defaults(options, {
          headers: {},
          jar: true
        });
        if (ua = headers["user-agent"]) {
          options.headers["user-agent"] = ua;
        }
        if (options.jar === true) {
          options.jar = newCookieJar();
        }
        _.extend(options, {
          strictSSL: false
        });
        self = this;
        if (jar = options.jar) {
          followRedirect = options.followRedirect;
          options.followRedirect = function(incomingRes) {
            var newUrl, req;
            req = this;
            newUrl = url.resolve(options.url, incomingRes.headers.location);
            req.init = _.wrap(req.init, (function(_this) {
              return function(orig, opts) {
                return self.setJarCookies(jar, automationFn).then(function() {
                  return automationFn("get:cookies", {
                    url: newUrl,
                    includeHostOnly: true
                  });
                }).then(convertToJarCookie).then(function(cookies) {
                  return setCookies(cookies, jar, null, newUrl);
                }).then(function() {
                  return orig.call(req, opts);
                });
              };
            })(this));
            return followRedirect.call(req, incomingRes);
          };
        }
        send = (function(_this) {
          return function() {
            var str;
            str = _this.create(options);
            str.getJar = function() {
              return options.jar;
            };
            return str;
          };
        })(this);
        return automationFn("get:cookies", {
          url: options.url,
          includeHostOnly: true
        }).then(convertToJarCookie).then(function(cookies) {
          return setCookies(cookies, options.jar, options.headers, options.url);
        }).then(send);
      },
      send: function(headers, automationFn, options) {
        var a, c, send, ua;
        if (options == null) {
          options = {};
        }
        _.defaults(options, {
          headers: {},
          gzip: true,
          jar: true,
          cookies: true,
          followRedirect: true
        });
        if (ua = headers["user-agent"]) {
          options.headers["user-agent"] = ua;
        }
        if (a = options.headers.Accept) {
          delete options.headers.Accept;
          options.headers.accept = a;
        }
        _.defaults(options.headers, {
          accept: "*/*"
        });
        if (options.jar === true) {
          options.jar = newCookieJar();
        }
        _.extend(options, {
          strictSSL: false,
          simple: false,
          resolveWithFullResponse: true
        });
        options.followAllRedirects = options.followRedirect;
        if (options.form === true) {
          options.form = options.body;
          delete options.json;
          delete options.body;
        }
        send = (function(_this) {
          return function() {
            var ms, push, redirects, requestResponses, self;
            ms = Date.now();
            self = _this;
            redirects = [];
            requestResponses = [];
            push = function(response) {
              return requestResponses.push(pick(response));
            };
            if (options.followRedirect) {
              options.followRedirect = function(incomingRes) {
                var jar, newUrl, req;
                newUrl = url.resolve(options.url, incomingRes.headers.location);
                redirects.push([incomingRes.statusCode, newUrl].join(": "));
                push(incomingRes);
                if (jar = options.jar) {
                  req = this;
                  req.init = _.wrap(req.init, (function(_this) {
                    return function(orig, opts) {
                      return self.setJarCookies(options.jar, automationFn).then(function() {
                        return automationFn("get:cookies", {
                          url: newUrl,
                          includeHostOnly: true
                        });
                      }).then(convertToJarCookie).then(function(cookies) {
                        return setCookies(cookies, jar, null, newUrl);
                      }).then(function() {
                        return orig.call(req, opts);
                      });
                    };
                  })(this));
                }
                return true;
              };
            }
            return _this.create(options, true).then(_this.normalizeResponse.bind(_this, push)).then(function(resp) {
              var loc;
              resp.duration = Date.now() - ms;
              resp.allRequestResponses = requestResponses;
              if (redirects.length) {
                resp.redirects = redirects;
              }
              if (options.followRedirect === false && (loc = resp.headers.location)) {
                resp.redirectedToUrl = url.resolve(options.url, loc);
              }
              if (options.jar) {
                return _this.setJarCookies(options.jar, automationFn)["return"](resp);
              } else {
                return resp;
              }
            });
          };
        })(this);
        if (c = options.cookies) {
          if (_.isObject(c)) {
            setCookies(c, null, options.headers);
            return send();
          } else {
            return automationFn("get:cookies", {
              url: options.url,
              includeHostOnly: true
            }).then(convertToJarCookie).then(function(cookies) {
              return setCookies(cookies, options.jar, options.headers, options.url);
            }).then(send);
          }
        } else {
          return send();
        }
      }
    };
  };

}).call(this);
