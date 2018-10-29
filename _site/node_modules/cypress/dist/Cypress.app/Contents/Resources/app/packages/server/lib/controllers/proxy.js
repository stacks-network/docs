(function() {
  var Promise, _, accept, blacklist, buffers, concat, conditional, cors, cwd, debug, networkFailures, redirectRe, rewriter, setCookie, through, zlib,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  _ = require("lodash");

  zlib = require("zlib");

  concat = require("concat-stream");

  through = require("through");

  Promise = require("bluebird");

  accept = require("http-accept");

  debug = require("debug")("cypress:server:proxy");

  cwd = require("../cwd");

  cors = require("../util/cors");

  buffers = require("../util/buffers");

  rewriter = require("../util/rewriter");

  blacklist = require("../util/blacklist");

  conditional = require("../util/conditional_stream");

  networkFailures = require("../util/network_failures");

  redirectRe = /^30(1|2|3|7|8)$/;

  zlib = Promise.promisifyAll(zlib);

  setCookie = function(res, key, val, domainName) {
    var options;
    options = {
      domain: domainName
    };
    if (!val) {
      val = "";
      options.expires = new Date(0);
    }
    return res.cookie(key, val, options);
  };

  module.exports = {
    handle: function(req, res, config, getRemoteState, request) {
      var blh, matched, remoteState, thr;
      remoteState = getRemoteState();
      debug("handling proxied request %o", {
        url: req.url,
        proxiedUrl: req.proxiedUrl,
        cookies: req.cookies,
        remoteState: remoteState
      });
      if (req.cookies["__cypress.unload"]) {
        return res.redirect(config.clientRoute);
      }
      if (req.url === req.proxiedUrl && !remoteState.visiting) {
        return res.redirect(config.clientRoute);
      }
      if (blh = config.blacklistHosts) {
        if (matched = blacklist.matches(req.proxiedUrl, blh)) {
          res.set("x-cypress-matched-blacklisted-host", matched);
          debug("blacklisting request %o", {
            url: req.proxiedUrl,
            matched: matched
          });
          return res.status(503).end();
        }
      }
      thr = through(function(d) {
        return this.queue(d);
      });
      return this.getHttpContent(thr, req, res, remoteState, config, request).pipe(res);
    },
    getHttpContent: function(thr, req, res, remoteState, config, request) {
      var a, base64, encodings, endWithResponseErr, err, getErrorHtml, isInitial, obj, onResponse, opts, ref, remoteUrl, reqAcceptsHtml, resContentTypeIs, resMatchesOriginPolicy, rq, setBody, setCookies, wantsInjection, wantsSecurityRemoved;
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
      remoteUrl = req.proxiedUrl;
      isInitial = req.cookies["__cypress.initial"] === "true";
      wantsInjection = null;
      wantsSecurityRemoved = null;
      resContentTypeIs = function(respHeaders, str) {
        var contentType;
        contentType = respHeaders["content-type"];
        return contentType && contentType.includes(str);
      };
      reqAcceptsHtml = function() {
        var find, ref, types;
        if (req.headers["x-requested-with"]) {
          return;
        }
        types = (ref = accept.parser(req.headers.accept)) != null ? ref : [];
        find = function(type) {
          return indexOf.call(types, type) >= 0;
        };
        return find("text/html") && find("application/xhtml+xml");
      };
      resMatchesOriginPolicy = function(respHeaders) {
        switch (remoteState.strategy) {
          case "http":
            return cors.urlMatchesOriginPolicyProps(remoteUrl, remoteState.props);
          case "file":
            return remoteUrl.startsWith(remoteState.origin);
        }
      };
      setCookies = (function(_this) {
        return function(value) {
          if ((!value) && (!wantsInjection)) {
            return;
          }
          if (!isInitial) {
            return;
          }
          return setCookie(res, "__cypress.initial", value, remoteState.domainName);
        };
      })(this);
      getErrorHtml = (function(_this) {
        return function(err, filePath) {
          var ref, status, urlStr;
          status = (ref = err.status) != null ? ref : 500;
          debug("request failed %o", {
            url: remoteUrl,
            status: status,
            err: err.message
          });
          urlStr = filePath != null ? filePath : remoteUrl;
          return networkFailures.get(err, urlStr, status, remoteState.strategy);
        };
      })(this);
      setBody = (function(_this) {
        return function(str, statusCode, headers) {
          var encoding, injection, isGzipped, rewrite;
          res.status(statusCode);
          setCookies(false, wantsInjection);
          debug("received response for %o", {
            url: remoteUrl,
            headers: headers,
            statusCode: statusCode
          });
          encoding = headers["content-encoding"];
          isGzipped = encoding && encoding.includes("gzip");
          if (!wantsInjection) {
            if (config.modifyObstructiveCode && wantsSecurityRemoved) {
              return str.pipe(conditional(isGzipped, zlib.createGunzip())).pipe(rewriter.security()).pipe(conditional(isGzipped, zlib.createGzip())).pipe(thr);
            } else {
              return str.pipe(thr);
            }
          } else {
            rewrite = function(body) {
              return rewriter.html(body.toString(), remoteState.domainName, wantsInjection, config.modifyObstructiveCode);
            };
            injection = concat(function(body) {
              if (isGzipped) {
                return zlib.gunzipAsync(body).then(rewrite).then(zlib.gzipAsync).then(thr.end)["catch"](endWithResponseErr);
              } else {
                return thr.end(rewrite(body));
              }
            });
            return str.pipe(injection);
          }
        };
      })(this);
      endWithResponseErr = function(err) {
        var checkResStatus, ref, ref1, status, str;
        checkResStatus = function() {
          if (res.headersSent) {
            return res.statusCode;
          }
        };
        status = (ref = (ref1 = err.status) != null ? ref1 : checkResStatus()) != null ? ref : 500;
        if (!res.headersSent) {
          res.removeHeader("Content-Encoding");
        }
        str = through(function(d) {
          return this.queue(d);
        });
        onResponse(str, {
          statusCode: status,
          headers: {
            "content-type": "text/html"
          }
        });
        return str.end(getErrorHtml(err));
      };
      onResponse = (function(_this) {
        return function(str, incomingRes) {
          var c, cookies, err, filePath, headers, i, len, newUrl, ref, statusCode;
          headers = incomingRes.headers, statusCode = incomingRes.statusCode;
          if (wantsInjection == null) {
            wantsInjection = (function() {
              if (!resContentTypeIs(headers, "text/html")) {
                return false;
              }
              if (!resMatchesOriginPolicy(headers)) {
                return false;
              }
              if (isInitial) {
                return "full";
              }
              if (!reqAcceptsHtml()) {
                return false;
              }
              return "partial";
            })();
          }
          if (wantsSecurityRemoved == null) {
            wantsSecurityRemoved = (function() {
              return resContentTypeIs(headers, "application/javascript");
            })();
          }
          _this.setResHeaders(req, res, incomingRes, wantsInjection);
          if (cookies = headers["set-cookie"]) {
            ref = [].concat(cookies);
            for (i = 0, len = ref.length; i < len; i++) {
              c = ref[i];
              try {
                res.append("Set-Cookie", c);
              } catch (error) {
                err = error;
              }
            }
          }
          if (redirectRe.test(statusCode)) {
            newUrl = headers.location;
            setCookies(true);
            debug("redirecting to new url %o", {
              status: statusCode,
              url: newUrl
            });
            return res.redirect(statusCode, newUrl);
          } else {
            if (headers["x-cypress-file-server-error"]) {
              filePath = headers["x-cypress-file-path"];
              wantsInjection || (wantsInjection = "partial");
              str = through(function(d) {
                return this.queue(d);
              });
              setBody(str, statusCode, headers);
              return str.end(getErrorHtml({
                status: statusCode
              }, filePath));
            } else {
              return setBody(str, statusCode, headers);
            }
          }
        };
      })(this);
      if (obj = buffers.take(remoteUrl)) {
        wantsInjection = "full";
        if (err = obj.stream.error) {
          endWithResponseErr(err);
        } else {
          obj.stream.on("error", endWithResponseErr);
        }
        onResponse(obj.stream, obj.response);
      } else {
        opts = {
          followRedirect: false,
          strictSSL: false
        };
        encodings = (ref = accept.parser(req.headers["accept-encoding"])) != null ? ref : [];
        if (indexOf.call(encodings, "gzip") >= 0) {
          req.headers["accept-encoding"] = "gzip";
        } else {
          delete req.headers["accept-encoding"];
        }
        if (remoteState.strategy === "file" && req.proxiedUrl.startsWith(remoteState.origin)) {
          opts.url = req.proxiedUrl.replace(remoteState.origin, remoteState.fileServer);
        } else {
          opts.url = remoteUrl;
        }
        if ((a = remoteState.auth) && resMatchesOriginPolicy()) {
          if (!req.headers["authorization"]) {
            base64 = new Buffer(a.username + ":" + a.password).toString("base64");
            req.headers["authorization"] = "Basic " + base64;
          }
        }
        rq = request.create(opts);
        rq.on("error", endWithResponseErr);
        rq.on("response", function(incomingRes) {
          return onResponse(rq, incomingRes);
        });
        req.pipe(rq);
      }
      return thr;
    },
    setResHeaders: function(req, res, incomingRes, wantsInjection) {
      var headers;
      if (res.headersSent) {
        return;
      }
      headers = _.omit(incomingRes.headers, "set-cookie", "x-frame-options", "content-length", "content-security-policy");
      if (wantsInjection) {
        headers["cache-control"] = "no-cache, no-store, must-revalidate";
      }
      return res.set(headers);
    }
  };

}).call(this);
