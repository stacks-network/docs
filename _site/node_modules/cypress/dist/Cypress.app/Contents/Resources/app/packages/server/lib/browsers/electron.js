(function() {
  var EE, Promise, Windows, _, debug, menu, plugins, savedState;

  _ = require("lodash");

  EE = require("events");

  Promise = require("bluebird");

  debug = require("debug")("cypress:server:browsers:electron");

  plugins = require("../plugins");

  menu = require("../gui/menu");

  Windows = require("../gui/windows");

  savedState = require("../saved_state");

  module.exports = {
    _defaultOptions: function(projectPath, state, options) {
      var _this, defaults;
      _this = this;
      defaults = {
        x: state.browserX,
        y: state.browserY,
        width: state.browserWidth || 1280,
        height: state.browserHeight || 720,
        devTools: state.isBrowserDevToolsOpen,
        minWidth: 100,
        minHeight: 100,
        contextMenu: true,
        trackState: {
          width: "browserWidth",
          height: "browserHeight",
          x: "browserX",
          y: "browserY",
          devTools: "isBrowserDevToolsOpen"
        },
        onFocus: function() {
          return menu.set({
            withDevTools: true
          });
        },
        onNewWindow: function(e, url) {
          var _win;
          _win = this;
          return _this._launchChild(e, url, _win, projectPath, state, options).then(function(child) {
            return _win.on("close", function() {
              if (!child.isDestroyed()) {
                return child.close();
              }
            });
          });
        }
      };
      return _.defaultsDeep({}, options, defaults);
    },
    _render: function(url, projectPath, options) {
      var win;
      if (options == null) {
        options = {};
      }
      win = Windows.create(projectPath, options);
      return this._launch(win, url, options);
    },
    _launchChild: function(e, url, parent, projectPath, state, options) {
      var parentX, parentY, ref, win;
      e.preventDefault();
      ref = parent.getPosition(), parentX = ref[0], parentY = ref[1];
      options = this._defaultOptions(projectPath, state, options);
      _.extend(options, {
        x: parentX + 100,
        y: parentY + 100,
        trackState: false,
        onPaint: null
      });
      win = Windows.create(projectPath, options);
      e.newGuest = win;
      return this._launch(win, url, options);
    },
    _launch: function(win, url, options) {
      menu.set({
        withDevTools: true
      });
      debug("launching browser window to url %s with options %o", url, options);
      return Promise["try"]((function(_this) {
        return function() {
          var setProxy, ua;
          if (ua = options.userAgent) {
            _this._setUserAgent(win.webContents, ua);
          }
          setProxy = function() {
            var ps;
            if (ps = options.proxyServer) {
              return _this._setProxy(win.webContents, ps);
            }
          };
          return Promise.join(setProxy(), _this._clearCache(win.webContents));
        };
      })(this)).then(function() {
        return win.loadURL(url);
      })["return"](win);
    },
    _clearCache: function(webContents) {
      return new Promise(function(resolve) {
        return webContents.session.clearCache(resolve);
      });
    },
    _setUserAgent: function(webContents, userAgent) {
      webContents.setUserAgent(userAgent);
      return webContents.session.setUserAgent(userAgent);
    },
    _setProxy: function(webContents, proxyServer) {
      return new Promise(function(resolve) {
        return webContents.session.setProxy({
          proxyRules: proxyServer
        }, resolve);
      });
    },
    open: function(browserName, url, options, automation) {
      var projectPath;
      if (options == null) {
        options = {};
      }
      projectPath = options.projectPath;
      return savedState(projectPath).then(function(state) {
        return state.get();
      }).then((function(_this) {
        return function(state) {
          options = _this._defaultOptions(projectPath, state, options);
          options = Windows.defaults(options);
          return Promise["try"](function() {
            if (!plugins.has("before:browser:launch")) {
              return options;
            }
            return plugins.execute("before:browser:launch", options.browser, options).then(function(newOptions) {
              return newOptions != null ? newOptions : options;
            });
          });
        };
      })(this)).then((function(_this) {
        return function(options) {
          return _this._render(url, projectPath, options).then(function(win) {
            var a, call, events, invoke;
            a = Windows.automation(win);
            invoke = function(method, data) {
              return a[method](data);
            };
            automation.use({
              onRequest: function(message, data) {
                switch (message) {
                  case "get:cookies":
                    return invoke("getCookies", data);
                  case "get:cookie":
                    return invoke("getCookie", data);
                  case "set:cookie":
                    return invoke("setCookie", data);
                  case "clear:cookies":
                    return invoke("clearCookies", data);
                  case "clear:cookie":
                    return invoke("clearCookie", data);
                  case "is:automation:client:connected":
                    return invoke("isAutomationConnected", data);
                  case "take:screenshot":
                    return invoke("takeScreenshot");
                  default:
                    throw new Error("No automation handler registered for: '" + message + "'");
                }
              }
            });
            call = function(method) {
              return function() {
                if (!win.isDestroyed()) {
                  return win[method]();
                }
              };
            };
            events = new EE;
            win.once("closed", function() {
              debug("closed event fired");
              call("removeAllListeners");
              return events.emit("exit");
            });
            return _.extend(events, {
              browserWindow: win,
              kill: call("close"),
              removeAllListeners: call("removeAllListeners")
            });
          });
        };
      })(this));
    }
  };

}).call(this);
