(function() {
  var Promise, _, cp, errors, handlers, log, path, pluginsProcess, register, registeredEvents, util,
    slice = [].slice;

  _ = require("lodash");

  cp = require("child_process");

  path = require("path");

  log = require("debug")("cypress:server:plugins");

  Promise = require("bluebird");

  errors = require("../errors");

  util = require("./util");

  pluginsProcess = null;

  registeredEvents = {};

  handlers = [];

  register = function(event, callback) {
    log("register event '" + event + "'");
    if (!_.isString(event)) {
      throw new Error("The plugin register function must be called with an event as its 1st argument. You passed '" + event + "'.");
    }
    if (!_.isFunction(callback)) {
      throw new Error("The plugin register function must be called with a callback function as its 2nd argument. You passed '" + callback + "'.");
    }
    return registeredEvents[event] = callback;
  };

  module.exports = {
    registerHandler: function(handler) {
      return handlers.push(handler);
    },
    init: function(config, options) {
      log("plugins.init", config.pluginsFile);
      return new Promise(function(resolve, reject) {
        var handleError, handler, i, ipc, killPluginsProcess, len;
        if (!config.pluginsFile) {
          return resolve();
        }
        if (pluginsProcess) {
          log("kill existing plugins process");
          pluginsProcess.kill();
        }
        registeredEvents = {};
        pluginsProcess = cp.fork(path.join(__dirname, "child", "index.js"), ["--file", config.pluginsFile]);
        ipc = util.wrapIpc(pluginsProcess);
        for (i = 0, len = handlers.length; i < len; i++) {
          handler = handlers[i];
          handler(ipc);
        }
        ipc.send("load", config);
        ipc.on("loaded", function(newCfg, registrations) {
          _.each(registrations, function(registration) {
            log("register plugins process event", registration.event, "with id", registration.callbackId);
            return register(registration.event, function() {
              var args;
              args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
              return util.wrapParentPromise(ipc, registration.callbackId, function(invocationId) {
                var ids;
                log("call event", registration.event, "for invocation id", invocationId);
                ids = {
                  callbackId: registration.callbackId,
                  invocationId: invocationId
                };
                return ipc.send("execute", registration.event, ids, args);
              });
            });
          });
          return resolve(newCfg);
        });
        ipc.on("load:error", function() {
          var args, type;
          type = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
          return reject(errors.get.apply(errors, [type].concat(slice.call(args))));
        });
        killPluginsProcess = function() {
          pluginsProcess && pluginsProcess.kill();
          return pluginsProcess = null;
        };
        handleError = function(err) {
          log("plugins process error:", err.stack);
          killPluginsProcess();
          err = errors.get("PLUGINS_ERROR", err.annotated || err.stack || err.message);
          err.title = "Error running plugin";
          return options.onError(err);
        };
        pluginsProcess.on("error", handleError);
        ipc.on("error", handleError);
        return process.on("exit", killPluginsProcess);
      });
    },
    register: register,
    has: function(event) {
      return !!registeredEvents[event];
    },
    execute: function() {
      var args, event;
      event = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
      log.apply(null, ["execute plugin event '" + event + "' with args: %s"].concat(slice.call(args)));
      return registeredEvents[event].apply(registeredEvents, args);
    },
    _reset: function() {
      registeredEvents = {};
      return handlers = [];
    }
  };

}).call(this);
