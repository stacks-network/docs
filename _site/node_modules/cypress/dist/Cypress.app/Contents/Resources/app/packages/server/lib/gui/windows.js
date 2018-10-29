(function() {
  var BrowserWindow, Promise, _, contextMenu, cwd, cyDesktop, debug, extension, firstOrNull, getByType, getCookieUrl, getUrl, recentlyCreatedWindow, savedState, uri, user, windows;

  _ = require("lodash");

  uri = require("url");

  Promise = require("bluebird");

  cyDesktop = require("@packages/desktop-gui");

  extension = require("@packages/extension");

  contextMenu = require("electron-context-menu");

  BrowserWindow = require("electron").BrowserWindow;

  debug = require("debug")("cypress:server:windows");

  cwd = require("../cwd");

  user = require("../user");

  savedState = require("../saved_state");

  windows = {};

  recentlyCreatedWindow = false;

  getUrl = function(type) {
    switch (type) {
      case "GITHUB_LOGIN":
        return user.getLoginUrl();
      case "INDEX":
        return cyDesktop.getPathToIndex();
      default:
        throw new Error("No acceptable window type found for: '" + type + "'");
    }
  };

  getByType = function(type) {
    return windows[type];
  };

  getCookieUrl = function(props) {
    return extension.getCookieUrl(props);
  };

  firstOrNull = function(cookies) {
    var ref;
    return (ref = cookies[0]) != null ? ref : null;
  };

  module.exports = {
    reset: function() {
      return windows = {};
    },
    destroy: function(type) {
      var win;
      if (type && (win = getByType(type))) {
        return win.destroy();
      }
    },
    get: function(type) {
      var ref;
      return (function() {
        if ((ref = getByType(type)) != null) {
          return ref;
        } else {
          throw new Error("No window exists for: '" + type + "'");
        }
      })();
    },
    showAll: function() {
      return _.invoke(windows, "showInactive");
    },
    hideAllUnlessAnotherWindowIsFocused: function() {
      if (BrowserWindow.getFocusedWindow() || recentlyCreatedWindow) {
        return;
      }
      return _.invoke(windows, "hide");
    },
    getByWebContents: function(webContents) {
      return BrowserWindow.fromWebContents(webContents);
    },
    getBrowserAutomation: function(webContents) {
      var win;
      win = this.getByWebContents(webContents);
      return this.automation(win);
    },
    _newBrowserWindow: function(options) {
      return new BrowserWindow(options);
    },
    automation: function(win) {
      var cookies;
      cookies = Promise.promisifyAll(win.webContents.session.cookies);
      return {
        clear: function(filter) {
          var clear;
          if (filter == null) {
            filter = {};
          }
          clear = (function(_this) {
            return function(cookie) {
              var url;
              url = getCookieUrl(cookie);
              return cookies.removeAsync(url, cookie.name)["return"](cookie);
            };
          })(this);
          return this.getAll(filter).map(clear);
        },
        getAll: function(filter) {
          return cookies.getAsync(filter);
        },
        getCookies: function(filter) {
          return this.getAll(filter);
        },
        getCookie: function(filter) {
          return this.getAll(filter).then(firstOrNull);
        },
        setCookie: function(props) {
          if (props == null) {
            props = {};
          }
          if (props.url == null) {
            props.url = getCookieUrl(props);
          }
          return cookies.setAsync(props)["return"](props);
        },
        clearCookie: function(filter) {
          return this.clear(filter).then(firstOrNull);
        },
        clearCookies: function(filter) {
          return this.clear(filter);
        },
        isAutomationConnected: function() {
          return true;
        },
        takeScreenshot: function() {
          return new Promise(function(resolve) {
            return win.capturePage(function(img) {
              return resolve(img.toDataURL());
            });
          });
        }
      };
    },
    defaults: function(options) {
      if (options == null) {
        options = {};
      }
      return _.defaultsDeep(options, {
        x: null,
        y: null,
        show: true,
        frame: true,
        width: null,
        height: null,
        minWidth: null,
        minHeight: null,
        devTools: false,
        trackState: false,
        contextMenu: false,
        recordFrameRate: null,
        onPaint: null,
        onFocus: function() {},
        onBlur: function() {},
        onClose: function() {},
        onCrashed: function() {},
        onNewWindow: function() {},
        webPreferences: {
          chromeWebSecurity: true,
          nodeIntegration: false,
          backgroundThrottling: false
        }
      });
    },
    create: function(projectPath, options) {
      var setFrameRate, ts, win;
      if (options == null) {
        options = {};
      }
      options = this.defaults(options);
      if (options.show === false) {
        options.frame = false;
        options.webPreferences.offscreen = true;
      }
      if (options.chromeWebSecurity === false) {
        options.webPreferences.webSecurity = false;
      }
      win = this._newBrowserWindow(options);
      win.on("blur", function() {
        return options.onBlur.apply(win, arguments);
      });
      win.on("focus", function() {
        return options.onFocus.apply(win, arguments);
      });
      win.once("closed", function() {
        win.removeAllListeners();
        return options.onClose.apply(win, arguments);
      });
      win.webContents.on("crashed", function() {
        return options.onCrashed.apply(win, arguments);
      });
      win.webContents.on("new-window", function() {
        return options.onNewWindow.apply(win, arguments);
      });
      if (ts = options.trackState) {
        this.trackState(projectPath, win, ts);
      }
      if (options.devTools) {
        win.webContents.openDevTools();
      }
      if (options.contextMenu) {
        contextMenu({
          showInspectElement: false,
          window: win
        });
      }
      if (options.onPaint) {
        setFrameRate = function(num) {
          if (win.webContents.getFrameRate() !== num) {
            return win.webContents.setFrameRate(num);
          }
        };
        win.webContents.on("paint", function(event, dirty, image) {
          var err, fr;
          try {
            if (fr = options.recordFrameRate) {
              setFrameRate(fr);
            }
            return options.onPaint.apply(win, arguments);
          } catch (error) {
            err = error;
          }
        });
      }
      return win;
    },
    open: function(projectPath, options) {
      var err, urlChanged, win;
      if (options == null) {
        options = {};
      }
      if (win = getByType(options.type)) {
        win.show();
        if (options.type === "GITHUB_LOGIN") {
          err = new Error;
          err.alreadyOpen = true;
          return Promise.reject(err);
        } else {
          return Promise.resolve(win);
        }
      }
      recentlyCreatedWindow = true;
      _.defaults(options, {
        width: 600,
        height: 500,
        show: true,
        url: getUrl(options.type),
        webPreferences: {
          preload: cwd("lib", "ipc", "ipc.js")
        }
      });
      urlChanged = function(url, resolve) {
        var code, parsed;
        parsed = uri.parse(url, true);
        if (code = parsed.query.code) {
          _.defer(function() {
            return win.destroy();
          });
          return resolve(code);
        }
      };
      win = this.create(projectPath, options);
      debug("creating electron window with options %o", options);
      windows[options.type] = win;
      win.webContents.id = _.uniqueId("webContents");
      win.once("closed", function() {
        return delete windows[options.type];
      });
      return Promise.resolve(options.url).then(function(url) {
        win.loadURL(url);
        recentlyCreatedWindow = false;
        if (options.type === "GITHUB_LOGIN") {
          return new Promise(function(resolve, reject) {
            win.once("closed", function() {
              err = new Error("Window closed by user");
              err.windowClosed = true;
              return reject(err);
            });
            win.webContents.on("will-navigate", function(e, url) {
              return urlChanged(url, resolve);
            });
            return win.webContents.on("did-get-redirect-request", function(e, oldUrl, newUrl) {
              return urlChanged(newUrl, resolve);
            });
          });
        } else {
          return win;
        }
      });
    },
    trackState: function(projectPath, win, keys) {
      var isDestroyed;
      isDestroyed = function() {
        return win.isDestroyed();
      };
      win.on("resize", _.debounce(function() {
        var height, newState, ref, ref1, width, x, y;
        if (isDestroyed()) {
          return;
        }
        ref = win.getSize(), width = ref[0], height = ref[1];
        ref1 = win.getPosition(), x = ref1[0], y = ref1[1];
        newState = {};
        newState[keys.width] = width;
        newState[keys.height] = height;
        newState[keys.x] = x;
        newState[keys.y] = y;
        return savedState(projectPath).then(function(state) {
          return state.set(newState);
        });
      }, 500));
      win.on("moved", _.debounce(function() {
        var newState, ref, x, y;
        if (isDestroyed()) {
          return;
        }
        ref = win.getPosition(), x = ref[0], y = ref[1];
        newState = {};
        newState[keys.x] = x;
        newState[keys.y] = y;
        return savedState(projectPath).then(function(state) {
          return state.set(newState);
        });
      }, 500));
      win.webContents.on("devtools-opened", function() {
        var newState;
        newState = {};
        newState[keys.devTools] = true;
        return savedState(projectPath).then(function(state) {
          return state.set(newState);
        });
      });
      return win.webContents.on("devtools-closed", function() {
        var newState;
        newState = {};
        newState[keys.devTools] = false;
        return savedState(projectPath).then(function(state) {
          return state.set(newState);
        });
      });
    }
  };

}).call(this);
