(function() {
  var _, anyUnderscoredValuePairs, backup, coerce, commasForBars, config, cwd, everythingAfterFirstEqualRe, hasStrayEndQuote, minimist, nestedArraysInSquareBracketsRe, nestedObjectsInCurlyBracesRe, normalizeBackslash, normalizeBackslashes, path, removeLastCharacter, sanitizeAndConvertNestedArgs, strToArray, whitelist;

  _ = require("lodash");

  path = require("path");

  minimist = require("minimist");

  coerce = require("./coerce");

  config = require("../config");

  cwd = require("../cwd");

  nestedObjectsInCurlyBracesRe = /\{(.+?)\}/g;

  nestedArraysInSquareBracketsRe = /\[(.+?)\]/g;

  everythingAfterFirstEqualRe = /=(.+)/;

  whitelist = "cwd appPath execPath apiKey smokeTest getKey generateKey runProject project spec reporter reporterOptions port env ci record updating ping key logs clearLogs returnPkg version mode removeIds headed config exit exitWithCode browser headless outputPath group groupId parallel parallelId".split(" ");

  hasStrayEndQuote = function(s) {
    var quoteAt;
    quoteAt = s.indexOf('"');
    return quoteAt === s.length - 1;
  };

  removeLastCharacter = function(s) {
    return s.substr(0, s.length - 1);
  };

  normalizeBackslash = function(s) {
    if (hasStrayEndQuote(s)) {
      return removeLastCharacter(s);
    } else {
      return s;
    }
  };

  normalizeBackslashes = function(options) {
    var pathProperties;
    pathProperties = ["runProject", "project", "appPath", "execPath"];
    pathProperties.forEach(function(property) {
      if (options[property]) {
        return options[property] = normalizeBackslash(options[property]);
      }
    });
    return options;
  };

  backup = function(key, options) {
    return options["_" + key] = options[key];
  };

  anyUnderscoredValuePairs = function(val, key, obj) {
    var v;
    if (v = obj["_" + key]) {
      return v;
    }
    return val;
  };

  strToArray = function(str) {
    return [].concat(str.split(","));
  };

  commasForBars = function(match, p1) {
    return p1.split(",").join("|");
  };

  sanitizeAndConvertNestedArgs = function(str) {
    return _.chain(str).replace(nestedObjectsInCurlyBracesRe, commasForBars).replace(nestedArraysInSquareBracketsRe, commasForBars).split(",").map(function(pair) {
      return pair.split(everythingAfterFirstEqualRe);
    }).fromPairs().mapValues(coerce).value();
  };

  module.exports = {
    toObject: function(argv) {
      var c, configKeys, configValues, envs, op, options, p, ref, resolvePath, ro, spec, whitelisted;
      options = minimist(argv, {
        alias: {
          "app-path": "appPath",
          "exec-path": "execPath",
          "api-key": "apiKey",
          "smoke-test": "smokeTest",
          "remove-ids": "removeIds",
          "get-key": "getKey",
          "new-key": "generateKey",
          "clear-logs": "clearLogs",
          "run-project": "runProject",
          "return-pkg": "returnPkg",
          "headless": "isTextTerminal",
          "exit-with-code": "exitWithCode",
          "reporter-options": "reporterOptions",
          "output-path": "outputPath",
          "group-id": "groupId"
        }
      });
      whitelisted = _.pick(argv, whitelist);
      options = _.chain(options).defaults(whitelisted).defaults({
        cwd: process.cwd()
      }).mapValues(coerce).value();
      if (options.updating && !options.appPath) {
        ref = options._.slice(-2), options.appPath = ref[0], options.execPath = ref[1];
      }
      if (spec = options.spec) {
        backup("spec", options);
        resolvePath = function(p) {
          return path.resolve(options.cwd, p);
        };
        options.spec = strToArray(spec).map(resolvePath);
      }
      if (envs = options.env) {
        backup("env", options);
        options.env = sanitizeAndConvertNestedArgs(envs);
      }
      if (ro = options.reporterOptions) {
        backup("reporterOptions", options);
        options.reporterOptions = sanitizeAndConvertNestedArgs(ro);
      }
      if (c = options.config) {
        backup("config", options);
        options.config = sanitizeAndConvertNestedArgs(c);
      }
      configKeys = config.getConfigKeys();
      configValues = _.pick(options, configKeys);
      _.each(configValues, function(val, key) {
        if (options.config == null) {
          options.config = {};
        }
        return options.config[key] = val;
      });
      options = normalizeBackslashes(options);
      if (p = options.project || options.runProject) {
        options.projectPath = path.resolve(options.cwd, p);
      }
      if (op = options.outputPath) {
        options.outputPath = path.resolve(options.cwd, op);
      }
      if (options.runProject) {
        options.run = true;
      }
      if (options.smokeTest) {
        options.pong = options.ping;
      }
      return options;
    },
    toArray: function(obj) {
      var ref;
      if (obj == null) {
        obj = {};
      }
      return (ref = _.chain(obj).mapValues(anyUnderscoredValuePairs)).pick.apply(ref, whitelist).mapValues(function(val, key) {
        return "--" + key + "=" + val;
      }).values().value();
    }
  };

}).call(this);
