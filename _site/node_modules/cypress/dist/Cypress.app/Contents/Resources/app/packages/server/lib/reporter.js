(function() {
  var Mocha, Promise, Reporter, STATS, _, chalk, createRunnable, createSuite, debug, events, mergeErr, mergeRunnable, mochaReporters, path, reporters, safelyMergeRunnable,
    slice = [].slice;

  _ = require("lodash");

  path = require("path");

  chalk = require("chalk");

  Mocha = require("mocha");

  debug = require("debug")("cypress:server:reporter");

  Promise = require("bluebird");

  mochaReporters = require("mocha/lib/reporters");

  STATS = "suites tests passes pending failures start end duration".split(" ");

  if (Mocha.Suite.prototype.titlePath) {
    throw new Error('Mocha.Suite.prototype.titlePath already exists. Please remove the monkeypatch code.');
  }

  Mocha.Suite.prototype.titlePath = function() {
    var result;
    result = [];
    if (this.parent) {
      result = result.concat(this.parent.titlePath());
    }
    if (!this.root) {
      result.push(this.title);
    }
    return result;
  };

  Mocha.Runnable.prototype.titlePath = function() {
    return this.parent.titlePath().concat([this.title]);
  };

  createSuite = function(obj, parent) {
    var suite;
    suite = new Mocha.Suite(obj.title, {});
    if (parent) {
      suite.parent = parent;
    }
    if (obj.file) {
      console.log('has file:', obj.file);
    }
    suite.file = obj.file;
    return suite;
  };

  createRunnable = function(obj, parent) {
    var body, fn, runnable;
    body = obj.body;
    if (body) {
      fn = function() {};
      fn.toString = function() {
        return body;
      };
    }
    runnable = new Mocha.Test(obj.title, fn);
    runnable.timedOut = obj.timedOut;
    runnable.async = obj.async;
    runnable.sync = obj.sync;
    runnable.duration = obj.duration;
    runnable.state = obj.state;
    if (runnable.body == null) {
      runnable.body = body;
    }
    if (parent) {
      runnable.parent = parent;
    }
    return runnable;
  };

  mergeRunnable = function(testProps, runnables) {
    var runnable;
    runnable = runnables[testProps.id];
    if (!runnable.started) {
      testProps.started = Date.now();
    }
    return _.extend(runnable, testProps);
  };

  safelyMergeRunnable = function(testProps, runnables) {
    return _.extend({}, runnables[testProps.id], testProps);
  };

  mergeErr = function(test, runnables, runner) {
    var runnable;
    runner.failures += 1;
    runnable = runnables[test.id];
    runnable.err = test.err;
    runnable.state = "failed";
    if (runnable.duration == null) {
      runnable.duration = test.duration;
    }
    runnable = _.extend({}, runnable, {
      title: test.title
    });
    return [runnable, test.err];
  };

  events = {
    "start": true,
    "end": true,
    "suite": mergeRunnable,
    "suite end": mergeRunnable,
    "test": mergeRunnable,
    "test end": mergeRunnable,
    "hook": safelyMergeRunnable,
    "hook end": safelyMergeRunnable,
    "pass": mergeRunnable,
    "pending": mergeRunnable,
    "fail": mergeErr
  };

  reporters = {
    teamcity: "@cypress/mocha-teamcity-reporter",
    junit: "mocha-junit-reporter"
  };

  Reporter = (function() {
    function Reporter(reporterName, reporterOptions, projectRoot) {
      if (reporterName == null) {
        reporterName = "spec";
      }
      if (reporterOptions == null) {
        reporterOptions = {};
      }
      if (!(this instanceof Reporter)) {
        return new Reporter(reporterName);
      }
      this.reporterName = reporterName;
      this.projectRoot = projectRoot;
      this.reporterOptions = reporterOptions;
    }

    Reporter.prototype.setRunnables = function(rootRunnable) {
      var reporter;
      if (rootRunnable == null) {
        rootRunnable = {};
      }
      this.runnables = {};
      rootRunnable = this._createRunnable(rootRunnable, "suite");
      reporter = Reporter.loadReporter(this.reporterName, this.projectRoot);
      this.mocha = new Mocha({
        reporter: reporter
      });
      this.mocha.suite = rootRunnable;
      this.runner = new Mocha.Runner(rootRunnable);
      this.reporter = new this.mocha._reporter(this.runner, {
        reporterOptions: this.reporterOptions
      });
      return this.runner.ignoreLeaks = true;
    };

    Reporter.prototype._createRunnable = function(runnableProps, type, parent) {
      var runnable, suite;
      runnable = (function() {
        switch (type) {
          case "suite":
            suite = createSuite(runnableProps, parent);
            suite.tests = _.map(runnableProps.tests, (function(_this) {
              return function(testProps) {
                return _this._createRunnable(testProps, "test", suite);
              };
            })(this));
            suite.suites = _.map(runnableProps.suites, (function(_this) {
              return function(suiteProps) {
                return _this._createRunnable(suiteProps, "suite", suite);
              };
            })(this));
            return suite;
          case "test":
            return createRunnable(runnableProps, parent);
          default:
            throw new Error("Unknown runnable type: '" + type + "'");
        }
      }).call(this);
      this.runnables[runnableProps.id] = runnable;
      return runnable;
    };

    Reporter.prototype.emit = function() {
      var args, event, ref;
      event = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
      if (args = this.parseArgs(event, args)) {
        return (ref = this.runner) != null ? ref.emit.apply(this.runner, args) : void 0;
      }
    };

    Reporter.prototype.parseArgs = function(event, args) {
      var e;
      if (e = events[event]) {
        if (_.isFunction(e)) {
          debug("got mocha event '%s' with args: %o", event, args);
          args = e.apply(this, args.concat(this.runnables, this.runner));
        }
        return [event].concat(args);
      }
    };

    Reporter.prototype.normalize = function(test) {
      var err, getParentTitle, ref, titles;
      if (test == null) {
        test = {};
      }
      getParentTitle = function(runnable, titles) {
        var p, t;
        if (p = runnable.parent) {
          if (t = p.title) {
            titles.unshift(t);
          }
          return getParentTitle(p, titles);
        } else {
          return titles;
        }
      };
      err = (ref = test.err) != null ? ref : {};
      titles = [test.title];
      return {
        clientId: test.id,
        title: getParentTitle(test, titles).join(" /// "),
        duration: test.duration,
        stack: err.stack,
        error: err.message,
        started: test.started
      };
    };

    Reporter.prototype.end = function() {
      var failures;
      if (this.reporter.done) {
        failures = this.runner.failures;
        return new Promise((function(_this) {
          return function(resolve, reject) {
            return _this.reporter.done(failures, resolve);
          };
        })(this)).then((function(_this) {
          return function() {
            return _this.stats();
          };
        })(this));
      } else {
        return this.stats();
      }
    };

    Reporter.prototype.stats = function() {
      var failingTests, stats;
      failingTests = _.chain(this.runnables).filter({
        state: "failed"
      }).map(this.normalize).value();
      stats = this.runner.stats;
      return _.extend({
        reporter: this.reporterName,
        failingTests: failingTests
      }, _.pick(stats, STATS));
    };

    Reporter.setVideoTimestamp = function(videoStart, tests) {
      if (tests == null) {
        tests = [];
      }
      return _.map(tests, function(test) {
        test.videoTimestamp = test.started - videoStart;
        return test;
      });
    };

    Reporter.create = function(reporterName, reporterOptions, projectRoot) {
      return new Reporter(reporterName, reporterOptions, projectRoot);
    };

    Reporter.loadReporter = function(reporterName, projectRoot) {
      var err, msg, r;
      debug("loading reporter " + reporterName);
      if (r = reporters[reporterName]) {
        debug(reporterName + " is built-in reporter");
        return require(r);
      }
      if (mochaReporters[reporterName]) {
        debug(reporterName + " is Mocha reporter");
        return reporterName;
      }
      try {
        debug("loading local reporter by name " + reporterName);
        return require(path.resolve(projectRoot, reporterName));
      } catch (error) {
        err = error;
        debug("loading NPM reporter module " + reporterName + " from " + projectRoot);
        try {
          return require(path.resolve(projectRoot, "node_modules", reporterName));
        } catch (error) {
          err = error;
          msg = "Could not find reporter module " + reporterName + " relative to " + projectRoot;
          throw new Error(msg);
        }
      }
    };

    Reporter.getSearchPathsForReporter = function(reporterName, projectRoot) {
      return _.uniq([path.resolve(projectRoot, reporterName), path.resolve(projectRoot, "node_modules", reporterName)]);
    };

    Reporter.isValidReporterName = function(reporterName, projectRoot) {
      try {
        Reporter.loadReporter(reporterName, projectRoot);
        debug("reporter " + reporterName + " is valid name");
        return true;
      } catch (error) {
        return false;
      }
    };

    return Reporter;

  })();

  module.exports = Reporter;

}).call(this);
