(function() {
  var DEFAULT_DOMAIN_NAME, Promise, Request, Server, Socket, _, allowDestroy, appData, blacklist, buffers, check, connect, cookie, cors, cwd, debug, errors, evilDns, express, fileServer, fullyQualifiedRe, hbs, headersUtil, http, httpProxy, httpsProxy, la, logger, origin, setProxiedUrl, statusCode, stream, url;

  _ = require("lodash");

  hbs = require("hbs");

  url = require("url");

  http = require("http");

  cookie = require("cookie");

  stream = require("stream");

  express = require("express");

  Promise = require("bluebird");

  evilDns = require("evil-dns");

  httpProxy = require("http-proxy");

  la = require("lazy-ass");

  check = require("check-more-types");

  httpsProxy = require("@packages/https-proxy");

  debug = require("debug")("cypress:server:server");

  cors = require("./util/cors");

  origin = require("./util/origin");

  connect = require("./util/connect");

  appData = require("./util/app_data");

  buffers = require("./util/buffers");

  blacklist = require("./util/blacklist");

  statusCode = require("./util/status_code");

  headersUtil = require("./util/headers");

  allowDestroy = require("./util/server_destroy");

  cwd = require("./cwd");

  errors = require("./errors");

  logger = require("./logger");

  Socket = require("./socket");

  Request = require("./request");

  fileServer = require("./file_server");

  DEFAULT_DOMAIN_NAME = "localhost";

  fullyQualifiedRe = /^https?:\/\//;

  setProxiedUrl = function(req) {
    if (req.proxiedUrl) {
      return;
    }
    req.proxiedUrl = req.url;
    return req.url = url.parse(req.url).path;
  };

  Server = (function() {
    function Server() {
      if (!(this instanceof Server)) {
        return new Server();
      }
      this._request = null;
      this._middleware = null;
      this._server = null;
      this._socket = null;
      this._baseUrl = null;
      this._wsProxy = null;
      this._fileServer = null;
      this._httpsProxy = null;
    }

    Server.prototype.createExpressApp = function(morgan) {
      var app;
      app = express();
      app.set("view engine", "html");
      app.engine("html", hbs.__express);
      app.use((function(_this) {
        return function(req, res, next) {
          var m;
          setProxiedUrl(req);
          if (m = _this._middleware) {
            m(req, res);
          }
          return next();
        };
      })(this));
      app.use(require("cookie-parser")());
      app.use(require("compression")());
      if (morgan) {
        app.use(require("morgan")("dev"));
      }
      app.use(require("errorhandler")());
      app.disable("x-powered-by");
      return app;
    };

    Server.prototype.createRoutes = function() {
      return require("./routes").apply(null, arguments);
    };

    Server.prototype.getHttpServer = function() {
      return this._server;
    };

    Server.prototype.portInUseErr = function(port) {
      var e;
      e = errors.get("PORT_IN_USE_SHORT", port);
      e.port = port;
      e.portInUse = true;
      return e;
    };

    Server.prototype.open = function(config, project) {
      if (config == null) {
        config = {};
      }
      la(_.isPlainObject(config), "expected plain config object", config);
      return Promise["try"]((function(_this) {
        return function() {
          var app, getRemoteState;
          buffers.reset();
          app = _this.createExpressApp(config.morgan);
          logger.setSettings(config);
          _this._request = Request({
            timeout: config.responseTimeout
          });
          getRemoteState = function() {
            return _this._getRemoteState();
          };
          _this.createHosts(config.hosts);
          _this.createRoutes(app, config, _this._request, getRemoteState, project);
          return _this.createServer(app, config, _this._request);
        };
      })(this));
    };

    Server.prototype.createHosts = function(hosts) {
      if (hosts == null) {
        hosts = {};
      }
      return _.each(hosts, function(ip, host) {
        return evilDns.add(host, ip);
      });
    };

    Server.prototype.createServer = function(app, config, request) {
      return new Promise((function(_this) {
        return function(resolve, reject) {
          var baseUrl, blacklistHosts, callListeners, fileServerFolder, onError, onSniUpgrade, onUpgrade, port, socketIoRoute;
          port = config.port, fileServerFolder = config.fileServerFolder, socketIoRoute = config.socketIoRoute, baseUrl = config.baseUrl, blacklistHosts = config.blacklistHosts;
          _this._server = http.createServer(app);
          _this._wsProxy = httpProxy.createProxyServer();
          allowDestroy(_this._server);
          onError = function(err) {
            if (err.code === "EADDRINUSE") {
              return reject(_this.portInUseErr(port));
            }
          };
          onUpgrade = function(req, socket, head) {
            debug("Got UPGRADE request from %s", req.url);
            return _this.proxyWebsockets(_this._wsProxy, socketIoRoute, req, socket, head);
          };
          callListeners = function(req, res) {
            var listeners;
            listeners = _this._server.listeners("request").slice(0);
            return _this._callRequestListeners(_this._server, listeners, req, res);
          };
          onSniUpgrade = function(req, socket, head) {
            var i, len, results, upgrade, upgrades;
            upgrades = _this._server.listeners("upgrade").slice(0);
            results = [];
            for (i = 0, len = upgrades.length; i < len; i++) {
              upgrade = upgrades[i];
              results.push(upgrade.call(_this._server, req, socket, head));
            }
            return results;
          };
          _this._server.on("connect", function(req, socket, head) {
            debug("Got CONNECT request from %s", req.url);
            return _this._httpsProxy.connect(req, socket, head, {
              onDirectConnection: function(req) {
                var isMatching, urlToCheck, word;
                urlToCheck = "https://" + req.url;
                isMatching = cors.urlMatchesOriginPolicyProps(urlToCheck, _this._remoteProps);
                word = isMatching ? "does" : "does not";
                debug("HTTPS request " + word + " match URL: " + urlToCheck + " with props: %o", _this._remoteProps);
                if (blacklistHosts && !isMatching) {
                  isMatching = blacklist.matches(urlToCheck, blacklistHosts);
                  debug("HTTPS request " + urlToCheck + " matches blacklist?", isMatching);
                }
                return !isMatching;
              }
            });
          });
          _this._server.on("upgrade", onUpgrade);
          _this._server.once("error", onError);
          return _this._listen(port, onError).then(function(port) {
            return Promise.all([
              httpsProxy.create(appData.path("proxy"), port, {
                onRequest: callListeners,
                onUpgrade: onSniUpgrade
              }), fileServer.create(fileServerFolder)
            ]).spread(function(httpsProxy, fileServer) {
              _this._httpsProxy = httpsProxy;
              _this._fileServer = fileServer;
              if (baseUrl) {
                _this._baseUrl = baseUrl;
                return connect.ensureUrl(baseUrl)["return"](null)["catch"](function(err) {
                  if (config.isTextTerminal) {
                    return reject(errors.get("CANNOT_CONNECT_BASE_URL", baseUrl));
                  } else {
                    return errors.get("CANNOT_CONNECT_BASE_URL_WARNING", baseUrl);
                  }
                });
              }
            }).then(function(warning) {
              _this._onDomainSet(baseUrl != null ? baseUrl : "<root>");
              return resolve([port, warning]);
            });
          });
        };
      })(this));
    };

    Server.prototype._port = function() {
      var ref, ref1;
      return (ref = this._server) != null ? (ref1 = ref.address()) != null ? ref1.port : void 0 : void 0;
    };

    Server.prototype._listen = function(port, onError) {
      return new Promise((function(_this) {
        return function(resolve) {
          var args, listener;
          listener = function() {
            port = _this._server.address().port;
            _this.isListening = true;
            debug("Server listening on port %s", port);
            _this._server.removeListener("error", onError);
            return resolve(port);
          };
          args = _.compact([port, listener]);
          return _this._server.listen.apply(_this._server, args);
        };
      })(this));
    };

    Server.prototype._getRemoteState = function() {
      var props;
      props = _.extend({}, {
        auth: this._remoteAuth,
        props: this._remoteProps,
        origin: this._remoteOrigin,
        strategy: this._remoteStrategy,
        visiting: this._remoteVisitingUrl,
        domainName: this._remoteDomainName,
        fileServer: this._remoteFileServer
      });
      debug("Getting remote state: %o", props);
      return props;
    };

    Server.prototype._onRequest = function(headers, automationRequest, options) {
      return this._request.send(headers, automationRequest, options);
    };

    Server.prototype._onResolveUrl = function(urlStr, headers, automationRequest, options) {
      var handlingLocalFile, obj, originalUrl, p, previousState, request;
      if (options == null) {
        options = {};
      }
      debug("resolving visit", {
        url: urlStr,
        headers: headers,
        options: options
      });
      request = this._request;
      handlingLocalFile = false;
      previousState = _.clone(this._getRemoteState());
      urlStr = url.parse(urlStr);
      urlStr.hash = null;
      urlStr = urlStr.format();
      originalUrl = urlStr;
      if (obj = buffers.getByOriginalUrl(urlStr)) {
        return request.setJarCookies(obj.jar, automationRequest).then(function(c) {
          return obj.details;
        });
      } else {
        return p = new Promise((function(_this) {
          return function(resolve, reject) {
            var error, handleReqStream, newUrl, redirects, restorePreviousState, urlFile;
            redirects = [];
            newUrl = null;
            if (!fullyQualifiedRe.test(urlStr)) {
              handlingLocalFile = true;
              _this._remoteVisitingUrl = true;
              _this._onDomainSet(urlStr, options);
              urlFile = url.resolve(_this._remoteFileServer, urlStr);
              urlStr = url.resolve(_this._remoteOrigin, urlStr);
            }
            error = function(err) {
              if (p.isPending()) {
                restorePreviousState();
              }
              return reject(err);
            };
            handleReqStream = function(str) {
              var pt;
              return pt = str.on("error", error).on("response", function(incomingRes) {
                var jar;
                str.removeListener("error", error);
                str.on("error", function(err) {
                  if (pt.listeners("error").length) {
                    return pt.emit("error", err);
                  } else {
                    return pt.error = err;
                  }
                });
                jar = str.getJar();
                return request.setJarCookies(jar, automationRequest).then(function(c) {
                  var contentType, details, fp, isHtml, isOk, statusIs2xxOrAllowedFailure;
                  _this._remoteVisitingUrl = false;
                  if (newUrl == null) {
                    newUrl = urlStr;
                  }
                  statusIs2xxOrAllowedFailure = function() {
                    return statusCode.isOk(incomingRes.statusCode) || (options.failOnStatusCode === false);
                  };
                  isOk = statusIs2xxOrAllowedFailure();
                  contentType = headersUtil.getContentType(incomingRes);
                  isHtml = contentType === "text/html";
                  details = {
                    isOkStatusCode: isOk,
                    isHtml: isHtml,
                    contentType: contentType,
                    url: newUrl,
                    status: incomingRes.statusCode,
                    cookies: c,
                    statusText: statusCode.getText(incomingRes.statusCode),
                    redirects: redirects,
                    originalUrl: originalUrl
                  };
                  if (fp = incomingRes.headers["x-cypress-file-path"]) {
                    details.filePath = fp;
                  }
                  debug("received response for resolving url %o", details);
                  if (isOk && isHtml) {
                    if (!handlingLocalFile) {
                      _this._onDomainSet(newUrl, options);
                    }
                    buffers.set({
                      url: newUrl,
                      jar: jar,
                      stream: pt,
                      details: details,
                      originalUrl: originalUrl,
                      response: incomingRes
                    });
                  } else {
                    restorePreviousState();
                  }
                  return resolve(details);
                })["catch"](error);
              }).pipe(stream.PassThrough());
            };
            restorePreviousState = function() {
              _this._remoteAuth = previousState.auth;
              _this._remoteProps = previousState.props;
              _this._remoteOrigin = previousState.origin;
              _this._remoteStrategy = previousState.strategy;
              _this._remoteFileServer = previousState.fileServer;
              _this._remoteDomainName = previousState.domainName;
              return _this._remoteVisitingUrl = previousState.visiting;
            };
            return request.sendStream(headers, automationRequest, {
              auth: options.auth,
              gzip: false,
              url: urlFile != null ? urlFile : urlStr,
              headers: {
                accept: "text/html,*/*"
              },
              followRedirect: function(incomingRes) {
                var curr, next, status;
                status = incomingRes.statusCode;
                next = incomingRes.headers.location;
                curr = newUrl != null ? newUrl : urlStr;
                newUrl = url.resolve(curr, next);
                redirects.push([status, newUrl].join(": "));
                return true;
              }
            }).then(handleReqStream)["catch"](error);
          };
        })(this));
      }
    };

    Server.prototype._onDomainSet = function(fullyQualifiedUrl, options) {
      var l, ref;
      if (options == null) {
        options = {};
      }
      l = function(type, val) {
        return debug("Setting", type, val);
      };
      this._remoteAuth = options.auth;
      l("remoteAuth", this._remoteAuth);
      if (fullyQualifiedUrl === "<root>" || !fullyQualifiedRe.test(fullyQualifiedUrl)) {
        this._remoteOrigin = "http://" + DEFAULT_DOMAIN_NAME + ":" + (this._port());
        this._remoteStrategy = "file";
        this._remoteFileServer = "http://" + DEFAULT_DOMAIN_NAME + ":" + ((ref = this._fileServer) != null ? ref.port() : void 0);
        this._remoteDomainName = DEFAULT_DOMAIN_NAME;
        this._remoteProps = null;
        l("remoteOrigin", this._remoteOrigin);
        l("remoteStrategy", this._remoteStrategy);
        l("remoteHostAndPort", this._remoteProps);
        l("remoteDocDomain", this._remoteDomainName);
        l("remoteFileServer", this._remoteFileServer);
      } else {
        this._remoteOrigin = origin(fullyQualifiedUrl);
        this._remoteStrategy = "http";
        this._remoteFileServer = null;
        this._remoteProps = cors.parseUrlIntoDomainTldPort(this._remoteOrigin);
        this._remoteDomainName = _.compact([this._remoteProps.domain, this._remoteProps.tld]).join(".");
        l("remoteOrigin", this._remoteOrigin);
        l("remoteHostAndPort", this._remoteProps);
        l("remoteDocDomain", this._remoteDomainName);
      }
      return this._getRemoteState();
    };

    Server.prototype._callRequestListeners = function(server, listeners, req, res) {
      var i, len, listener, results;
      results = [];
      for (i = 0, len = listeners.length; i < len; i++) {
        listener = listeners[i];
        results.push(listener.call(server, req, res));
      }
      return results;
    };

    Server.prototype._normalizeReqUrl = function(server) {
      var listeners;
      listeners = server.listeners("request").slice(0);
      server.removeAllListeners("request");
      return server.on("request", (function(_this) {
        return function(req, res) {
          setProxiedUrl(req);
          return _this._callRequestListeners(server, listeners, req, res);
        };
      })(this));
    };

    Server.prototype.proxyWebsockets = function(proxy, socketIoRoute, req, socket, head) {
      var host, hostname, port, protocol, remoteOrigin;
      if (req.url.startsWith(socketIoRoute)) {
        return;
      }
      if ((host = req.headers.host) && this._remoteProps && (remoteOrigin = this._remoteOrigin)) {
        port = this._remoteProps.port;
        protocol = url.parse(remoteOrigin).protocol;
        hostname = url.parse("http://" + host).hostname;
        return proxy.ws(req, socket, head, {
          secure: false,
          target: {
            host: hostname,
            port: port,
            protocol: protocol
          }
        });
      } else {
        if (socket.writable) {
          return socket.end();
        }
      }
    };

    Server.prototype.reset = function() {
      var ref;
      buffers.reset();
      return this._onDomainSet((ref = this._baseUrl) != null ? ref : "<root>");
    };

    Server.prototype._close = function() {
      this.reset();
      logger.unsetSettings();
      evilDns.clear();
      if (!this._server || !this.isListening) {
        return Promise.resolve();
      }
      return this._server.destroyAsync().then((function(_this) {
        return function() {
          return _this.isListening = false;
        };
      })(this));
    };

    Server.prototype.close = function() {
      var ref, ref1, ref2;
      return Promise.join(this._close(), (ref = this._socket) != null ? ref.close() : void 0, (ref1 = this._fileServer) != null ? ref1.close() : void 0, (ref2 = this._httpsProxy) != null ? ref2.close() : void 0).then((function(_this) {
        return function() {
          return _this._middleware = null;
        };
      })(this));
    };

    Server.prototype.end = function() {
      return this._socket && this._socket.end();
    };

    Server.prototype.changeToUrl = function(url) {
      return this._socket && this._socket.changeToUrl(url);
    };

    Server.prototype.onTestFileChange = function(filePath) {
      return this._socket && this._socket.onTestFileChange(filePath);
    };

    Server.prototype.onRequest = function(fn) {
      return this._middleware = fn;
    };

    Server.prototype.onNextRequest = function(fn) {
      return this.onRequest((function(_this) {
        return function() {
          fn.apply(_this, arguments);
          return _this._middleware = null;
        };
      })(this));
    };

    Server.prototype.startWebsockets = function(automation, config, options) {
      if (options == null) {
        options = {};
      }
      options.onResolveUrl = this._onResolveUrl.bind(this);
      options.onRequest = this._onRequest.bind(this);
      this._socket = Socket(config);
      this._socket.startListening(this._server, automation, config, options);
      return this._normalizeReqUrl(this._server);
    };

    return Server;

  })();

  module.exports = Server;

}).call(this);
