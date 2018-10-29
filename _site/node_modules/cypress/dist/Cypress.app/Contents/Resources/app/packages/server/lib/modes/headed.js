(function() {
  var EE, Events, Position, Promise, Windows, _, app, cyIcons, errors, image, isDev, logs, menu, os, savedState, user;

  _ = require("lodash");

  os = require("os");

  EE = require("events");

  app = require("electron").app;

  image = require("electron").nativeImage;

  Promise = require("bluebird");

  Position = require("electron-positioner");

  cyIcons = require("@cypress/icons");

  user = require("../user");

  errors = require("../errors");

  savedState = require("../saved_state");

  logs = require("../gui/logs");

  menu = require("../gui/menu");

  Events = require("../gui/events");

  Windows = require("../gui/windows");

  isDev = function() {
    return process.env["CYPRESS_ENV"] === "development";
  };

  module.exports = {
    isMac: function() {
      return os.platform() === "darwin";
    },
    getWindowArgs: function(state, options) {
      var common;
      if (options == null) {
        options = {};
      }
      common = {
        backgroundColor: "#dfe2e4",
        width: state.appWidth || 800,
        height: state.appHeight || 550,
        minWidth: 458,
        minHeight: 400,
        x: state.appX,
        y: state.appY,
        type: "INDEX",
        devTools: state.isAppDevToolsOpen,
        trackState: {
          width: "appWidth",
          height: "appHeight",
          x: "appX",
          y: "appY",
          devTools: "isAppDevToolsOpen"
        },
        onBlur: function() {
          if (this.webContents.isDevToolsOpened()) {
            return;
          }
          return Windows.hideAllUnlessAnotherWindowIsFocused();
        },
        onFocus: function() {
          menu.set({
            withDevTools: isDev()
          });
          return Windows.showAll();
        },
        onClose: function() {
          return process.exit();
        }
      };
      return _.extend(common, this.platformArgs());
    },
    platformArgs: function() {
      return {
        darwin: {
          show: true,
          frame: true,
          transparent: false
        },
        linux: {
          show: true,
          frame: true,
          transparent: false,
          icon: image.createFromPath(cyIcons.getPathToIcon("icon_128x128.png"))
        }
      }[os.platform()];
    },
    ready: function(options) {
      var bus, projectPath;
      if (options == null) {
        options = {};
      }
      bus = new EE;
      projectPath = options.projectPath;
      menu.set({
        withDevTools: isDev(),
        onLogOutClicked: function() {
          return bus.emit("menu:item:clicked", "log:out");
        }
      });
      return savedState(projectPath).then(function(state) {
        return state.get();
      }).then((function(_this) {
        return function(state) {
          return Windows.open(projectPath, _this.getWindowArgs(state, options)).then(function(win) {
            Events.start(_.extend({}, options, {
              onFocusTests: function() {
                return win.focus();
              },
              os: os.platform()
            }), bus);
            return win;
          });
        };
      })(this));
    },
    run: function(options) {
      var waitForReady;
      waitForReady = function() {
        return new Promise(function(resolve, reject) {
          return app.on("ready", resolve);
        });
      };
      return Promise.any([waitForReady(), Promise.delay(500)]).then((function(_this) {
        return function() {
          return _this.ready(options);
        };
      })(this));
    }
  };

}).call(this);
