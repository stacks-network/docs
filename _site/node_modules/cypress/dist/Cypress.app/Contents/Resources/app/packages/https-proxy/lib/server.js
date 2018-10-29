(function() {
  var Promise, Server, _, allowDestroy, fs, https, log, net, parse, semaphore, sslSemaphores, sslServers, url;

  _ = require("lodash");

  fs = require("fs-extra");

  net = require("net");

  url = require("url");

  https = require("https");

  Promise = require("bluebird");

  semaphore = require("semaphore");

  allowDestroy = require("server-destroy-vvo");

  log = require("debug")("cypress:https-proxy");

  parse = require("./util/parse");

  fs = Promise.promisifyAll(fs);

  sslServers = {};

  sslSemaphores = {};

  Server = (function() {
    function Server(_ca, _port) {
      this._ca = _ca;
      this._port = _port;
      this._onError = null;
    }

    Server.prototype.connect = function(req, socket, head, options) {
      var odc;
      if (options == null) {
        options = {};
      }
      if (!head || head.length === 0) {
        log("Writing socket connection headers for URL:", req.url);
        socket.once("data", (function(_this) {
          return function(data) {
            return _this.connect(req, socket, data, options);
          };
        })(this));
        socket.write("HTTP/1.1 200 OK\r\n");
        if (req.headers["proxy-connection"] === "keep-alive") {
          socket.write("Proxy-Connection: keep-alive\r\n");
          socket.write("Connection: keep-alive\r\n");
        }
        return socket.write("\r\n");
      } else {
        if (odc = options.onDirectConnection) {
          if (odc.call(this, req, socket, head) === true) {
            log("Making direct connection to " + req.url);
            return this._makeDirectConnection(req, socket, head);
          } else {
            log("Not making direct connection to " + req.url);
          }
        }
        socket.pause();
        return this._onServerConnectData(req, socket, head);
      }
    };

    Server.prototype._onUpgrade = function(fn, req, socket, head) {
      if (fn) {
        return fn.call(this, req, socket, head);
      }
    };

    Server.prototype._onRequest = function(fn, req, res) {
      var hostPort;
      hostPort = parse.hostAndPort(req.url, req.headers, 443);
      req.url = url.format({
        protocol: "https:",
        hostname: hostPort.host,
        port: hostPort.port
      }) + req.url;
      if (fn) {
        return fn.call(this, req, res);
      }
      return req.pipe(request(req.url)).on("error", function() {
        res.statusCode = 500;
        return res.end();
      }).pipe(res);
    };

    Server.prototype._makeDirectConnection = function(req, socket, head) {
      var hostname, port, ref;
      ref = url.parse("http://" + req.url), port = ref.port, hostname = ref.hostname;
      return this._makeConnection(socket, head, port, hostname);
    };

    Server.prototype._makeConnection = function(socket, head, port, hostname) {
      var args, cb, conn;
      cb = function() {
        socket.pipe(conn);
        conn.pipe(socket);
        socket.emit("data", head);
        return socket.resume();
      };
      args = _.compact([port, hostname, cb]);
      conn = net.connect.apply(net, args);
      return conn.on("error", (function(_this) {
        return function(err) {
          if (_this._onError) {
            return _this._onError(err, socket, head, port);
          }
        };
      })(this));
    };

    Server.prototype._onServerConnectData = function(req, socket, head) {
      var firstBytes, hostname, makeConnection, sem, sslServer;
      firstBytes = head[0];
      makeConnection = (function(_this) {
        return function(port) {
          log("Making intercepted connection to %s", port);
          return _this._makeConnection(socket, head, port);
        };
      })(this);
      if (firstBytes === 0x16 || firstBytes === 0x80 || firstBytes === 0x00) {
        hostname = url.parse("http://" + req.url).hostname;
        if (sslServer = sslServers[hostname]) {
          return makeConnection(sslServer.port);
        }
        if (!(sem = sslSemaphores[hostname])) {
          sem = sslSemaphores[hostname] = semaphore(1);
        }
        return sem.take((function(_this) {
          return function() {
            var leave;
            leave = function() {
              return process.nextTick(function() {
                return sem.leave();
              });
            };
            if (sslServer = sslServers[hostname]) {
              leave();
              return makeConnection(sslServer.port);
            }
            return _this._getPortFor(hostname).then(function(port) {
              sslServers[hostname] = {
                port: port
              };
              leave();
              return makeConnection(port);
            });
          };
        })(this));
      } else {
        return makeConnection(this._port);
      }
    };

    Server.prototype._normalizeKeyAndCert = function(certPem, privateKeyPem) {
      return {
        key: privateKeyPem,
        cert: certPem
      };
    };

    Server.prototype._getCertificatePathsFor = function(hostname) {
      return this._ca.getCertificateKeysForHostname(hostname).spread(this._normalizeKeyAndCert);
    };

    Server.prototype._generateMissingCertificates = function(hostname) {
      return this._ca.generateServerCertificateKeys(hostname).spread(this._normalizeKeyAndCert);
    };

    Server.prototype._getPortFor = function(hostname) {
      return this._getCertificatePathsFor(hostname)["catch"]((function(_this) {
        return function(err) {
          return _this._generateMissingCertificates(hostname);
        };
      })(this)).then((function(_this) {
        return function(data) {
          if (data == null) {
            data = {};
          }
          _this._sniServer.addContext(hostname, data);
          return _this._sniPort;
        };
      })(this));
    };

    Server.prototype.listen = function(options) {
      if (options == null) {
        options = {};
      }
      return new Promise((function(_this) {
        return function(resolve) {
          _this._onError = options.onError;
          _this._sniServer = https.createServer({});
          allowDestroy(_this._sniServer);
          _this._sniServer.on("upgrade", _this._onUpgrade.bind(_this, options.onUpgrade));
          _this._sniServer.on("request", _this._onRequest.bind(_this, options.onRequest));
          return _this._sniServer.listen(function() {
            _this._sniPort = _this._sniServer.address().port;
            log("Created SNI HTTPS Proxy on port %s", _this._sniPort);
            return resolve();
          });
        };
      })(this));
    };

    Server.prototype.close = function() {
      var close;
      close = (function(_this) {
        return function() {
          return new Promise(function(resolve) {
            return _this._sniServer.destroy(resolve);
          });
        };
      })(this);
      return close()["finally"](function() {
        return sslServers = {};
      });
    };

    return Server;

  })();

  module.exports = {
    reset: function() {
      return sslServers = {};
    },
    create: function(ca, port, options) {
      var srv;
      if (options == null) {
        options = {};
      }
      srv = new Server(ca, port);
      return srv.listen(options)["return"](srv);
    }
  };

}).call(this);
