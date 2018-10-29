(function() {
  var EE, Promise, _, log, serializeError,
    slice = [].slice;

  EE = require("events");

  _ = require("lodash");

  Promise = require("bluebird");

  log = require("debug")("cypress:server:plugins");

  serializeError = function(err) {
    return _.pick(err, "name", "message", "stack", "code", "annotated");
  };

  module.exports = {
    serializeError: serializeError,
    wrapIpc: function(aProcess) {
      var emitter;
      emitter = new EE();
      aProcess.on("message", function(message) {
        return emitter.emit.apply(emitter, [message.event].concat(slice.call(message.args)));
      });
      return {
        send: function() {
          var args, event;
          event = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
          if (aProcess.killed) {
            return;
          }
          return aProcess.send({
            event: event,
            args: args
          });
        },
        on: emitter.on.bind(emitter),
        removeListener: emitter.removeListener.bind(emitter)
      };
    },
    wrapChildPromise: function(ipc, invoke, ids, args) {
      if (args == null) {
        args = [];
      }
      return Promise["try"](function() {
        return invoke(ids.callbackId, args);
      }).then(function(value) {
        return ipc.send("promise:fulfilled:" + ids.invocationId, null, value);
      })["catch"](function(err) {
        return ipc.send("promise:fulfilled:" + ids.invocationId, serializeError(err));
      });
    },
    wrapParentPromise: function(ipc, callbackId, callback) {
      var invocationId;
      invocationId = _.uniqueId("inv");
      return new Promise(function(resolve, reject) {
        var handler;
        handler = function(err, value) {
          ipc.removeListener("promise:fulfilled:" + invocationId, handler);
          if (err) {
            log("promise rejected for id", invocationId, ":", err);
            reject(_.extend(new Error(err.message), err));
            return;
          }
          log("promise resolved for id '" + invocationId + "' with value", value);
          return resolve(value);
        };
        ipc.on("promise:fulfilled:" + invocationId, handler);
        return callback(invocationId);
      });
    }
  };

}).call(this);
