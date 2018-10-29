(function() {
  var Promise, Socket, _, automation, cwd, errors, exec, files, fixture, fs, isSpecialSpec, log, logger, open, path, pathHelpers, preprocessor, reporterEvents, retry, runnerEvents, socketIo, uuid,
    slice = [].slice;

  _ = require("lodash");

  fs = require("fs-extra");

  path = require("path");

  uuid = require("node-uuid");

  Promise = require("bluebird");

  socketIo = require("@packages/socket");

  open = require("./util/open");

  pathHelpers = require("./util/path_helpers");

  cwd = require("./cwd");

  exec = require("./exec");

  files = require("./files");

  fixture = require("./fixture");

  errors = require("./errors");

  logger = require("./logger");

  automation = require("./automation");

  preprocessor = require("./plugins/preprocessor");

  log = require('debug')('cypress:server:socket');

  runnerEvents = ["reporter:restart:test:run", "runnables:ready", "run:start", "test:before:run:async", "reporter:log:add", "reporter:log:state:changed", "paused", "test:after:hooks", "run:end"];

  reporterEvents = ["runner:restart", "runner:abort", "runner:console:log", "runner:console:error", "runner:show:snapshot", "runner:hide:snapshot", "reporter:restarted"];

  retry = function(fn) {
    return Promise.delay(25).then(fn);
  };

  isSpecialSpec = function(name) {
    return name.endsWith("__all");
  };

  Socket = (function() {
    function Socket(config) {
      if (!(this instanceof Socket)) {
        return new Socket(config);
      }
      this.ended = false;
      this.onTestFileChange = this.onTestFileChange.bind(this);
      if (config.watchForFileChanges) {
        preprocessor.emitter.on("file:updated", this.onTestFileChange);
      }
    }

    Socket.prototype.onTestFileChange = function(filePath) {
      log("test file changed: " + filePath);
      return fs.statAsync(filePath).then((function(_this) {
        return function() {
          return _this.io.emit("watched:file:changed");
        };
      })(this))["catch"](function() {
        return log("could not find test file that changed: " + filePath);
      });
    };

    Socket.prototype.watchTestFileByPath = function(config, originalFilePath, options) {
      var filePath;
      log("watch test file " + originalFilePath);
      filePath = path.join(config.integrationFolder, originalFilePath.replace("integration/", ""));
      filePath = path.relative(config.projectRoot, filePath);
      if (isSpecialSpec(filePath)) {
        return;
      }
      if (filePath === this.testFilePath) {
        return;
      }
      if (this.testFilePath) {
        preprocessor.removeFile(this.testFilePath, config);
      }
      this.testFilePath = filePath;
      log("will watch test file path " + filePath);
      return preprocessor.getFile(filePath, config, options)["catch"](function() {});
    };

    Socket.prototype.toReporter = function(event, data) {
      return this.io && this.io.to("reporter").emit(event, data);
    };

    Socket.prototype.toRunner = function(event, data) {
      return this.io && this.io.to("runner").emit(event, data);
    };

    Socket.prototype.isSocketConnected = function(socket) {
      return socket && socket.connected;
    };

    Socket.prototype.onAutomation = function(socket, message, data, id) {
      if (this.isSocketConnected(socket)) {
        return socket.emit("automation:request", id, message, data);
      } else {
        throw new Error("Could not process '" + message + "'. No automation clients connected.");
      }
    };

    Socket.prototype.createIo = function(server, path, cookie) {
      return socketIo.server(server, {
        path: path,
        destroyUpgrade: false,
        serveClient: false,
        cookie: cookie
      });
    };

    Socket.prototype.startListening = function(server, automation, config, options) {
      var automationClient, automationRequest, existingState, integrationFolder, onAutomationClientRequestCallback, socketIoCookie, socketIoRoute;
      existingState = null;
      _.defaults(options, {
        socketId: null,
        onSetRunnables: function() {},
        onMocha: function() {},
        onConnect: function() {},
        onRequest: function() {},
        onResolveUrl: function() {},
        onFocusTests: function() {},
        onSpecChanged: function() {},
        onChromiumRun: function() {},
        onReloadBrowser: function() {},
        checkForAppErrors: function() {},
        onSavedStateChanged: function() {},
        onTestFileChange: function() {}
      });
      automationClient = null;
      integrationFolder = config.integrationFolder, socketIoRoute = config.socketIoRoute, socketIoCookie = config.socketIoCookie;
      this.testsDir = integrationFolder;
      this.io = this.createIo(server, socketIoRoute, socketIoCookie);
      automation.use({
        onPush: (function(_this) {
          return function(message, data) {
            return _this.io.emit("automation:push:message", message, data);
          };
        })(this)
      });
      onAutomationClientRequestCallback = (function(_this) {
        return function(message, data, id) {
          return _this.onAutomation(automationClient, message, data, id);
        };
      })(this);
      automationRequest = function(message, data) {
        return automation.request(message, data, onAutomationClientRequestCallback);
      };
      return this.io.on("connection", (function(_this) {
        return function(socket) {
          var headers, ref, ref1;
          log("socket connected");
          headers = (ref = (ref1 = socket.request) != null ? ref1.headers : void 0) != null ? ref : {};
          socket.on("automation:client:connected", function() {
            if (automationClient === socket) {
              return;
            }
            automationClient = socket;
            log("automation:client connected");
            automationClient.on("disconnect", function() {
              if (_this.ended) {
                return;
              }
              return Promise.delay(500).then(function() {
                if (automationClient !== socket) {
                  return;
                }
                if (automationClient.connected) {
                  return;
                }
                errors.warning("AUTOMATION_SERVER_DISCONNECTED");
                return _this.io.emit("automation:disconnected");
              });
            });
            socket.on("automation:push:request", function(message, data, cb) {
              automation.push(message, data);
              if (cb) {
                return cb();
              }
            });
            return socket.on("automation:response", automation.response);
          });
          socket.on("automation:request", function(message, data, cb) {
            log("automation:request", message, data);
            return automationRequest(message, data).then(function(resp) {
              return cb({
                response: resp
              });
            })["catch"](function(err) {
              return cb({
                error: errors.clone(err)
              });
            });
          });
          socket.on("reporter:connected", function() {
            if (socket.inReporterRoom) {
              return;
            }
            socket.inReporterRoom = true;
            return socket.join("reporter");
          });
          socket.on("runner:connected", function() {
            if (socket.inRunnerRoom) {
              return;
            }
            socket.inRunnerRoom = true;
            return socket.join("runner");
          });
          socket.on("spec:changed", function(spec) {
            return options.onSpecChanged(spec);
          });
          socket.on("watch:test:file", function(filePath, cb) {
            if (cb == null) {
              cb = function() {};
            }
            _this.watchTestFileByPath(config, filePath, options);
            return cb();
          });
          socket.on("app:connect", function(socketId) {
            return options.onConnect(socketId, socket);
          });
          socket.on("set:runnables", function(runnables, cb) {
            options.onSetRunnables(runnables);
            return cb();
          });
          socket.on("mocha", function() {
            return options.onMocha.apply(options, arguments);
          });
          socket.on("open:finder", function(p, cb) {
            if (cb == null) {
              cb = function() {};
            }
            return open.opn(p).then(function() {
              return cb();
            });
          });
          socket.on("reload:browser", function(url, browser) {
            return options.onReloadBrowser(url, browser);
          });
          socket.on("focus:tests", function() {
            return options.onFocusTests();
          });
          socket.on("is:automation:client:connected", function(data, cb) {
            var isConnected, ref2, tryConnected;
            if (data == null) {
              data = {};
            }
            isConnected = function() {
              return automationRequest("is:automation:client:connected", data);
            };
            tryConnected = function() {
              return Promise["try"](isConnected)["catch"](function() {
                return retry(tryConnected);
              });
            };
            return Promise["try"](tryConnected).timeout((ref2 = data.timeout) != null ? ref2 : 1000).then(function() {
              return cb(true);
            })["catch"](Promise.TimeoutError, function(err) {
              return cb(false);
            });
          });
          socket.on("backend:request", function() {
            var args, backendRequest, cb, eventName;
            eventName = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
            cb = args.pop();
            log("backend:request", {
              eventName: eventName,
              args: args
            });
            backendRequest = function() {
              var resolveOpts, url;
              switch (eventName) {
                case "preserve:run:state":
                  existingState = args[0];
                  return null;
                case "resolve:url":
                  url = args[0], resolveOpts = args[1];
                  return options.onResolveUrl(url, headers, automationRequest, resolveOpts);
                case "http:request":
                  return options.onRequest(headers, automationRequest, args[0]);
                case "get:fixture":
                  return fixture.get(config.fixturesFolder, args[0], args[1]);
                case "read:file":
                  return files.readFile(config.projectRoot, args[0], args[1]);
                case "write:file":
                  return files.writeFile(config.projectRoot, args[0], args[1], args[2]);
                case "exec":
                  return exec.run(config.projectRoot, args[0]);
                default:
                  throw new Error("You requested a backend event we cannot handle: " + eventName);
              }
            };
            return Promise["try"](backendRequest).then(function(resp) {
              return cb({
                response: resp
              });
            })["catch"](function(err) {
              return cb({
                error: errors.clone(err)
              });
            });
          });
          socket.on("get:existing:run:state", function(cb) {
            var s;
            if ((s = existingState)) {
              existingState = null;
              return cb(s);
            } else {
              return cb();
            }
          });
          socket.on("save:app:state", function(state, cb) {
            options.onSavedStateChanged(state);
            if (cb) {
              return cb();
            }
          });
          reporterEvents.forEach(function(event) {
            return socket.on(event, function(data) {
              return _this.toRunner(event, data);
            });
          });
          return runnerEvents.forEach(function(event) {
            return socket.on(event, function(data) {
              return _this.toReporter(event, data);
            });
          });
        };
      })(this));
    };

    Socket.prototype.end = function() {
      this.ended = true;
      return this.io && this.io.emit("tests:finished");
    };

    Socket.prototype.changeToUrl = function(url) {
      return this.toRunner("change:to:url", url);
    };

    Socket.prototype.close = function() {
      var ref;
      preprocessor.emitter.removeListener("file:updated", this.onTestFileChange);
      return (ref = this.io) != null ? ref.close() : void 0;
    };

    return Socket;

  })();

  module.exports = Socket;

}).call(this);
