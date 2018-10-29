(function() {
  var Cookies, Promise, Screenshot, _, assertValidOptions, uuid,
    slice = [].slice;

  _ = require("lodash");

  uuid = require("uuid");

  Promise = require("bluebird");

  Cookies = require("./cookies");

  Screenshot = require("./screenshot");

  assertValidOptions = function() {
    var keys, options;
    options = arguments[0], keys = 2 <= arguments.length ? slice.call(arguments, 1) : [];
    return _.each(keys, function(key) {
      if (!(key in options)) {
        throw new Error("Automation requires the key: " + key + ". You passed in:", options);
      }
    });
  };

  module.exports = {
    create: function(cyNamespace, cookieNamespace, screenshotsFolder) {
      var automationValve, cookies, get, invokeAsync, middleware, normalize, requestAutomationResponse, requests, screenshot;
      requests = {};
      middleware = {
        onPush: null,
        onBeforeRequest: null,
        onRequest: null,
        onResponse: null,
        onAfterResponse: null
      };
      cookies = Cookies(cyNamespace, cookieNamespace);
      screenshot = Screenshot(screenshotsFolder);
      get = function(fn) {
        return middleware[fn];
      };
      invokeAsync = function() {
        var args, fn;
        fn = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
        return Promise["try"](function() {
          if (fn = get(fn)) {
            return fn.apply(null, args);
          }
        });
      };
      requestAutomationResponse = function(message, data, fn) {
        return new Promise((function(_this) {
          return function(resolve, reject) {
            var id;
            id = uuid.v4();
            requests[id] = function(obj) {
              var e, err;
              if (e = obj.__error) {
                err = new Error(e);
                err.name = obj.__name;
                err.stack = obj.__stack;
                return reject(err);
              } else {
                return resolve(obj.response);
              }
            };
            return fn(message, data, id);
          };
        })(this));
      };
      automationValve = function(message, fn) {
        return function(msg, data) {
          var onReq;
          if (!data) {
            data = msg;
            msg = message;
          }
          if (onReq = get("onRequest")) {
            return onReq(msg, data);
          } else {
            return requestAutomationResponse(msg, data, fn);
          }
        };
      };
      normalize = function(message, data, automate) {
        return Promise["try"](function() {
          switch (message) {
            case "take:screenshot":
              return screenshot.capture(data, automate);
            case "get:cookies":
              return cookies.getCookies(data, automate);
            case "get:cookie":
              return cookies.getCookie(data, automate);
            case "set:cookie":
              return cookies.setCookie(data, automate);
            case "clear:cookies":
              return cookies.clearCookies(data, automate);
            case "clear:cookie":
              return cookies.clearCookie(data, automate);
            case "change:cookie":
              return cookies.changeCookie(data);
            default:
              return automate(data);
          }
        });
      };
      return {
        _requests: requests,
        use: function(middlewares) {
          if (middlewares == null) {
            middlewares = {};
          }
          return _.extend(middleware, middlewares);
        },
        push: function(message, data) {
          return normalize(message, data).then(function(data) {
            if (data) {
              return invokeAsync("onPush", message, data);
            }
          });
        },
        request: function(message, data, fn) {
          var automate;
          automate = automationValve(message, fn);
          return invokeAsync("onBeforeRequest", message, data).then(function() {
            return normalize(message, data, automate);
          }).then(function(resp) {
            return invokeAsync("onAfterResponse", message, data, resp)["return"](resp);
          });
        },
        response: function(id, resp) {
          var request;
          if (request = requests[id]) {
            delete request[id];
            return request(resp);
          }
        }
      };
    }
  };

}).call(this);
