(function() {
  var Project, Promise, _, browsers, config, create, files, log,
    slice = [].slice;

  _ = require("lodash");

  Promise = require("bluebird");

  files = require("./controllers/files");

  config = require("./config");

  Project = require("./project");

  browsers = require("./browsers");

  log = require('./log');

  create = function() {
    var openProject, relaunchBrowser, reset, specIntervalId, tryToCall;
    openProject = null;
    specIntervalId = null;
    relaunchBrowser = null;
    reset = function() {
      openProject = null;
      return relaunchBrowser = null;
    };
    tryToCall = function(method) {
      return function() {
        var args;
        args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
        if (openProject) {
          return openProject[method].apply(openProject, args);
        } else {
          return Promise.resolve(null);
        }
      };
    };
    return {
      reset: tryToCall("reset"),
      getConfig: tryToCall("getConfig"),
      createCiProject: tryToCall("createCiProject"),
      getRecordKeys: tryToCall("getRecordKeys"),
      getRuns: tryToCall("getRuns"),
      requestAccess: tryToCall("requestAccess"),
      emit: tryToCall("emit"),
      getProject: function() {
        return openProject;
      },
      launch: function(browserName, spec, options) {
        if (options == null) {
          options = {};
        }
        log("launching browser %s spec %s", browserName, spec);
        return this.reset().then(function() {
          return openProject.ensureSpecUrl(spec);
        }).then(function(url) {
          return openProject.getConfig().then(function(cfg) {
            var am, automation;
            options.browsers = cfg.browsers;
            options.proxyUrl = cfg.proxyUrl;
            options.userAgent = cfg.userAgent;
            options.proxyServer = cfg.proxyUrl;
            options.socketIoRoute = cfg.socketIoRoute;
            options.chromeWebSecurity = cfg.chromeWebSecurity;
            options.url = url;
            automation = openProject.getAutomation();
            if (am = options.automationMiddleware) {
              automation.use(am);
            }
            return (relaunchBrowser = function() {
              log("launching project in browser " + browserName);
              return browsers.open(browserName, options, automation);
            })();
          });
        });
      },
      getSpecChanges: function(options) {
        var checkForSpecUpdates, currentSpecs, get, sendIfChanged;
        if (options == null) {
          options = {};
        }
        currentSpecs = null;
        _.defaults(options, {
          onChange: function() {},
          onError: function() {}
        });
        sendIfChanged = function(specs) {
          if (specs == null) {
            specs = [];
          }
          if (_.isEqual(specs, currentSpecs)) {
            return;
          }
          currentSpecs = specs;
          return options.onChange(specs);
        };
        checkForSpecUpdates = (function(_this) {
          return function() {
            if (!openProject) {
              return _this.clearSpecInterval();
            }
            return get().then(sendIfChanged)["catch"](options.onError);
          };
        })(this);
        get = function() {
          return openProject.getConfig().then(function(cfg) {
            return files.getTestFiles(cfg);
          });
        };
        specIntervalId = setInterval(checkForSpecUpdates, 2500);
        return checkForSpecUpdates();
      },
      clearSpecInterval: function() {
        if (specIntervalId) {
          clearInterval(specIntervalId);
          return specIntervalId = null;
        }
      },
      closeBrowser: function() {
        return browsers.close();
      },
      closeOpenProjectAndBrowsers: function() {
        return Promise.all([this.closeBrowser(), openProject ? openProject.close() : void 0]).then(function() {
          reset();
          return null;
        });
      },
      close: function() {
        log("closing opened project");
        this.clearSpecInterval();
        return this.closeOpenProjectAndBrowsers();
      },
      create: function(path, args, options) {
        if (args == null) {
          args = {};
        }
        if (options == null) {
          options = {};
        }
        openProject = Project(path);
        _.defaults(options, {
          onReloadBrowser: (function(_this) {
            return function(url, browser) {
              if (relaunchBrowser) {
                return relaunchBrowser();
              }
            };
          })(this)
        });
        options = _.extend({}, args.config, options);
        return browsers.get().then(function(b) {
          if (b == null) {
            b = [];
          }
          options.browsers = b;
          log("opening project %s", path);
          return openProject.open(options);
        })["return"](this);
      }
    };
  };

  module.exports = create();

  module.exports.Factory = create;

}).call(this);
