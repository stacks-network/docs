(function() {
  var HOST, PATH, Promise, automation, connect, firstOrNull, httpRe, map, once, pick,
    slice = [].slice;

  map = require("lodash/map");

  pick = require("lodash/pick");

  once = require("lodash/once");

  Promise = require("bluebird");

  HOST = "CHANGE_ME_HOST";

  PATH = "CHANGE_ME_PATH";

  httpRe = /^http/;

  firstOrNull = function(cookies) {
    var ref;
    return (ref = cookies[0]) != null ? ref : null;
  };

  connect = function(host, path, io) {
    var client, fail, invoke, listenToCookieChanges;
    if (io == null) {
      io = global.io;
    }
    if (!io) {
      return;
    }
    listenToCookieChanges = once(function() {
      return chrome.cookies.onChanged.addListener(function(info) {
        if (info.cause !== "overwrite") {
          return client.emit("automation:push:request", "change:cookie", info);
        }
      });
    });
    fail = function(id, err) {
      return client.emit("automation:response", id, {
        __error: err.message,
        __stack: err.stack,
        __name: err.name
      });
    };
    invoke = function() {
      var args, id, method, respond;
      method = arguments[0], id = arguments[1], args = 3 <= arguments.length ? slice.call(arguments, 2) : [];
      respond = function(data) {
        return client.emit("automation:response", id, {
          response: data
        });
      };
      return Promise["try"](function() {
        return automation[method].apply(automation, args.concat(respond));
      })["catch"](function(err) {
        return fail(id, err);
      });
    };
    client = io.connect(host, {
      path: path,
      transports: ["websocket"]
    });
    client.on("automation:request", function(id, msg, data) {
      switch (msg) {
        case "get:cookies":
          return invoke("getCookies", id, data);
        case "get:cookie":
          return invoke("getCookie", id, data);
        case "set:cookie":
          return invoke("setCookie", id, data);
        case "clear:cookies":
          return invoke("clearCookies", id, data);
        case "clear:cookie":
          return invoke("clearCookie", id, data);
        case "is:automation:client:connected":
          return invoke("verify", id, data);
        case "focus:browser:window":
          return invoke("focus", id);
        case "take:screenshot":
          return invoke("takeScreenshot", id);
        default:
          return fail(id, {
            message: "No handler registered for: '" + msg + "'"
          });
      }
    });
    client.on("connect", function() {
      listenToCookieChanges();
      return client.emit("automation:client:connected");
    });
    return client;
  };

  connect(HOST, PATH, global.io);

  automation = {
    connect: connect,
    getUrl: function(cookie) {
      var prefix;
      if (cookie == null) {
        cookie = {};
      }
      prefix = cookie.secure ? "https://" : "http://";
      return prefix + cookie.domain + cookie.path;
    },
    clear: function(filter) {
      var clear;
      if (filter == null) {
        filter = {};
      }
      clear = (function(_this) {
        return function(cookie) {
          return new Promise(function(resolve, reject) {
            var props, url;
            url = _this.getUrl(cookie);
            props = {
              url: url,
              name: cookie.name
            };
            return chrome.cookies.remove(props, function(details) {
              var err, ref;
              if (details) {
                return resolve(cookie);
              } else {
                err = new Error("Removing cookie failed for: " + (JSON.stringify(props)));
                return reject((ref = chrome.runtime.lastError) != null ? ref : err);
              }
            });
          });
        };
      })(this);
      return this.getAll(filter).map(clear);
    },
    getAll: function(filter) {
      var get;
      if (filter == null) {
        filter = {};
      }
      get = function() {
        return new Promise(function(resolve) {
          return chrome.cookies.getAll(filter, resolve);
        });
      };
      return get();
    },
    getCookies: function(filter, fn) {
      return this.getAll(filter).then(fn);
    },
    getCookie: function(filter, fn) {
      return this.getAll(filter).then(firstOrNull).then(fn);
    },
    setCookie: function(props, fn) {
      var set;
      if (props == null) {
        props = {};
      }
      set = (function(_this) {
        return function() {
          return new Promise(function(resolve, reject) {
            if (props.url == null) {
              props.url = _this.getUrl(props);
            }
            return chrome.cookies.set(props, function(details) {
              var err;
              switch (false) {
                case !details:
                  return resolve(details);
                case !(err = chrome.runtime.lastError):
                  return reject(err);
                default:
                  return resolve(null);
              }
            });
          });
        };
      })(this);
      return set().then(fn);
    },
    clearCookie: function(filter, fn) {
      return this.clear(filter).then(firstOrNull).then(fn);
    },
    clearCookies: function(filter, fn) {
      return this.clear(filter).then(fn);
    },
    focus: function(fn) {
      return chrome.windows.getCurrent(function(window) {
        return chrome.windows.update(window.id, {
          focused: true
        }, function() {
          return fn();
        });
      });
    },
    query: function(data) {
      var code, query, queryTab;
      code = "var s; (s = document.getElementById('" + data.element + "')) && s.textContent";
      query = function() {
        return new Promise(function(resolve) {
          return chrome.tabs.query({
            windowType: "normal"
          }, resolve);
        });
      };
      queryTab = function(tab) {
        return new Promise(function(resolve, reject) {
          return chrome.tabs.executeScript(tab.id, {
            code: code
          }, function(result) {
            if (result && result[0] === data.string) {
              return resolve();
            } else {
              return reject(new Error);
            }
          });
        });
      };
      return query().filter(function(tab) {
        return httpRe.test(tab.url);
      }).then(function(tabs) {
        return map(tabs, queryTab);
      }).any();
    },
    verify: function(data, fn) {
      return this.query(data).then(fn);
    },
    lastFocusedWindow: function() {
      return new Promise(function(resolve) {
        return chrome.windows.getLastFocused(resolve);
      });
    },
    takeScreenshot: function(fn) {
      return this.lastFocusedWindow().then(function(win) {
        return new Promise(function(resolve, reject) {
          return chrome.tabs.captureVisibleTab(win.id, {
            format: "png"
          }, function(dataUrl) {
            if (dataUrl) {
              return resolve(dataUrl);
            } else {
              return reject(chrome.runtime.lastError);
            }
          });
        });
      }).then(fn);
    }
  };

  module.exports = automation;

}).call(this);
