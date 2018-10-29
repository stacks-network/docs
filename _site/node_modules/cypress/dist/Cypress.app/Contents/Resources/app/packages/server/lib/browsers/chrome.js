(function() {
  var LOAD_EXTENSION, Promise, _, _normalizeArgExtensions, appData, debug, defaultArgs, extension, fs, os, pathToExtension, pathToTheme, plugins, utils;

  _ = require("lodash");

  os = require("os");

  fs = require("fs-extra");

  Promise = require("bluebird");

  extension = require("@packages/extension");

  debug = require("debug")("cypress:server:browsers");

  plugins = require("../plugins");

  appData = require("../util/app_data");

  utils = require("./utils");

  fs = Promise.promisifyAll(fs);

  LOAD_EXTENSION = "--load-extension=";

  pathToExtension = extension.getPathToExtension();

  pathToTheme = extension.getPathToTheme();

  defaultArgs = ["--test-type", "--ignore-certificate-errors", "--start-maximized", "--silent-debugger-extension-api", "--no-default-browser-check", "--no-first-run", "--noerrdialogs", "--enable-fixed-layout", "--disable-popup-blocking", "--disable-password-generation", "--disable-save-password-bubble", "--disable-single-click-autofill", "--disable-prompt-on-repos", "--disable-background-timer-throttling", "--disable-renderer-backgrounding", "--disable-renderer-throttling", "--disable-restore-session-state", "--disable-translate", "--disable-new-profile-management", "--disable-new-avatar-menu", "--allow-insecure-localhost", "--reduce-security-for-testing", "--enable-automation", "--disable-infobars", "--metrics-recording-only", "--disable-prompt-on-repost", "--disable-hang-monitor", "--disable-sync", "--disable-web-resources", "--safebrowsing-disable-auto-update", "--safebrowsing-disable-download-protection", "--disable-client-side-phishing-detection", "--disable-component-update", "--disable-default-apps"];

  _normalizeArgExtensions = function(dest, args) {
    var extensions, loadExtension, userExtensions;
    loadExtension = _.find(args, function(arg) {
      return arg.includes(LOAD_EXTENSION);
    });
    if (loadExtension) {
      args = _.without(args, loadExtension);
      userExtensions = loadExtension.replace(LOAD_EXTENSION, "").split(",");
    }
    extensions = [].concat(userExtensions, dest, pathToTheme);
    args.push(LOAD_EXTENSION + _.compact(extensions).join(","));
    return args;
  };

  module.exports = {
    _normalizeArgExtensions: _normalizeArgExtensions,
    _writeExtension: function(proxyUrl, socketIoRoute) {
      return extension.setHostAndPath(proxyUrl, socketIoRoute).then(function(str) {
        var extensionBg, extensionDest;
        extensionDest = appData.path("extensions", "chrome");
        extensionBg = appData.path("extensions", "chrome", "background.js");
        return utils.copyExtension(pathToExtension, extensionDest).then(function() {
          return fs.writeFileAsync(extensionBg, str);
        })["return"](extensionDest);
      });
    },
    _getArgs: function(options) {
      var args, ps, ua;
      if (options == null) {
        options = {};
      }
      args = [].concat(defaultArgs);
      if (os.platform() === "linux") {
        args.push("--disable-gpu");
        args.push("--no-sandbox");
      }
      if (ua = options.userAgent) {
        args.push("--user-agent=" + ua);
      }
      if (ps = options.proxyServer) {
        args.push("--proxy-server=" + ps);
      }
      if (options.chromeWebSecurity === false) {
        args.push("--disable-web-security");
        args.push("--allow-running-insecure-content");
      }
      return args;
    },
    open: function(browserName, url, options, automation) {
      var args;
      if (options == null) {
        options = {};
      }
      args = this._getArgs(options);
      return Promise["try"](function() {
        if (!plugins.has("before:browser:launch")) {
          return;
        }
        return plugins.execute("before:browser:launch", options.browser, args).then(function(newArgs) {
          debug("got user args for 'before:browser:launch'", newArgs);
          if (newArgs) {
            return args = newArgs;
          }
        });
      }).then((function(_this) {
        return function() {
          return Promise.all([utils.ensureCleanCache(browserName), _this._writeExtension(options.proxyUrl, options.socketIoRoute)]);
        };
      })(this)).spread(function(cacheDir, dest) {
        var userDir;
        args = _normalizeArgExtensions(dest, args);
        userDir = utils.getProfileDir(browserName);
        args.push("--user-data-dir=" + userDir);
        args.push("--disk-cache-dir=" + cacheDir);
        debug("launch in chrome: %s, %s", url, args);
        return utils.launch(browserName, url, args);
      });
    }
  };

}).call(this);
