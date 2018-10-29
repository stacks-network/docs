(function() {
  var Promise, _, cleanup, debug, errors, find, fs, getBrowser, getByName, instance, kill, path, utils;

  _ = require("lodash");

  fs = require("fs-extra");

  path = require("path");

  Promise = require("bluebird");

  debug = require("debug")("cypress:server:browsers");

  utils = require("./utils");

  errors = require("../errors");

  fs = Promise.promisifyAll(fs);

  instance = null;

  kill = function(unbind) {
    if (!instance) {
      return Promise.resolve();
    }
    return new Promise(function(resolve) {
      if (unbind) {
        instance.removeAllListeners();
      }
      instance.once("exit", function(code, sigint) {
        debug("browser process killed");
        return resolve.apply(null, arguments);
      });
      debug("killing browser process");
      instance.kill();
      return cleanup();
    });
  };

  cleanup = function() {
    return instance = null;
  };

  getBrowser = function(name) {
    switch (name) {
      case "chrome":
      case "chromium":
      case "canary":
        return require("./chrome");
      case "electron":
        return require("./electron");
    }
  };

  find = function(browser, browsers) {
    if (browsers == null) {
      browsers = [];
    }
    return _.find(browsers, {
      name: browser
    });
  };

  getByName = function(browser) {
    return utils.getBrowsers().then(function(browsers) {
      if (browsers == null) {
        browsers = [];
      }
      return find(browser, browsers);
    });
  };

  process.once("exit", kill);

  module.exports = {
    get: utils.getBrowsers,
    launch: utils.launch,
    close: kill,
    find: find,
    getByName: getByName,
    open: function(name, options, automation) {
      if (options == null) {
        options = {};
      }
      return kill(true).then(function() {
        var browser, names, url;
        _.defaults(options, {
          onBrowserOpen: function() {},
          onBrowserClose: function() {}
        });
        if (!(browser = getBrowser(name))) {
          names = _.map(options.browsers, "name").join(", ");
          return errors["throw"]("BROWSER_NOT_FOUND", name, names);
        }
        options.browser = find(name, options.browsers);
        if (!(url = options.url)) {
          throw new Error("options.url must be provided when opening a browser. You passed:", options);
        }
        debug("opening browser %s", name);
        return browser.open(name, url, options, automation).then(function(i) {
          debug("browser opened");
          instance = i;
          instance.once("exit", function() {
            options.onBrowserClose();
            return cleanup();
          });
          return Promise.delay(1000).then(function() {
            options.onBrowserOpen();
            return instance;
          });
        });
      });
    }
  };

}).call(this);
