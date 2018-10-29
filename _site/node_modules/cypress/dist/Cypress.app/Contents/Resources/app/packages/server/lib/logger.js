(function() {
  var Promise, _, appData, createFile, folder, fs, getName, getPathToLog, logger, path, transports, winston,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
    slice = [].slice;

  path = require("path");

  _ = require("lodash");

  fs = require("fs-extra");

  Promise = require("bluebird");

  winston = require("winston");

  appData = require("./util/app_data");

  folder = appData.path();

  getName = function(name) {
    return name + ".log";
  };

  getPathToLog = function(name) {
    return path.join(folder, getName(name));
  };

  createFile = function(name, level, opts) {
    var file, obj;
    if (opts == null) {
      opts = {};
    }
    file = getPathToLog(name);
    fs.ensureDirSync(path.dirname(file));
    obj = {
      name: name,
      filename: file,
      colorize: true,
      tailable: true,
      maxsize: 1000000
    };
    if (level) {
      obj.level = level;
    }
    _.extend(obj, opts);
    return new winston.transports.File(obj);
  };

  transports = [
    createFile("all", null, {
      handleExceptions: true
    })
  ];

  if (process.env.CYPRESS_DEBUG) {
    transports.push(new winston.transports.Console());
  }

  logger = new winston.Logger({
    transports: transports,
    exitOnError: function(err) {
      return logger.defaultErrorHandler(err);
    }
  });

  logger.createException = function(err) {
    return require("./exception").create(err, logger.getSettings());
  };

  logger.defaultErrorHandler = function(err) {
    var exit, handleErr;
    logger.info("caught error", {
      error: err.message,
      stack: err.stack
    });
    exit = function() {
      return process.exit(1);
    };
    handleErr = function() {
      var e, ret;
      if (e = logger.errorHandler) {
        ret = e(err);
        if (ret === true) {
          return exit();
        }
      } else {
        console.log(err);
        console.log(err.stack);
        return exit();
      }
    };
    logger.createException(err).then(handleErr)["catch"](handleErr);
    return false;
  };

  logger.setSettings = function(obj) {
    return logger._settings = obj;
  };

  logger.getSettings = function() {
    return logger._settings;
  };

  logger.unsetSettings = function() {
    return delete logger._settings;
  };

  logger.setErrorHandler = function(fn) {
    return logger.errorHandler = fn;
  };

  logger.getData = function(obj) {
    var keys;
    keys = ["level", "message", "timestamp", "type"];
    return _.reduce(obj, function(memo, value, key) {
      if (indexOf.call(keys, key) < 0) {
        memo.data[key] = value;
      } else {
        memo[key] = value;
      }
      return memo;
    }, {
      data: {}
    });
  };

  logger.normalize = function(logs) {
    if (logs == null) {
      logs = [];
    }
    return _.map(logs, logger.getData);
  };

  logger.getLogs = function() {
    var transport;
    transport = "all";
    return new Promise(function(resolve, reject) {
      var opts, ref, t;
      opts = {
        limit: 500,
        order: "desc"
      };
      t = (function() {
        if ((ref = logger.transports[transport]) != null) {
          return ref;
        } else {
          throw new Error("Log transport: '" + transport + "' does not exist!");
        }
      })();
      return t.query(opts, function(err, results) {
        if (err) {
          return reject(err);
        }
        return resolve(logger.normalize(results));
      });
    });
  };

  logger.off = function() {
    return logger.removeAllListeners("logging");
  };

  logger.onLog = function(fn) {
    var name;
    name = "all";
    logger.off();
    return logger.on("logging", function(transport, level, msg, data) {
      var obj;
      if (transport.name === name) {
        obj = {
          level: level,
          message: msg
        };
        obj.type = data.type;
        obj.data = _.omit(data, "type");
        obj.timestamp = new Date;
        return fn(obj);
      }
    });
  };

  logger.clearLogs = function() {
    var files;
    files = _.map(logger.transports, function(value, key) {
      return fs.outputFileAsync(getPathToLog(key), "");
    });
    return Promise.all(files);
  };

  logger.log = _.wrap(logger.log, function() {
    var args, last, orig;
    orig = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
    last = _.last(args);
    if (_.isObject(last)) {
      _.defaults(last, {
        type: "server"
      });
    }
    return orig.apply(this, args);
  });

  process.removeAllListeners("unhandledRejection");

  process.on("unhandledRejection", function(err, promise) {
    logger.defaultErrorHandler(err);
    return false;
  });

  module.exports = logger;

}).call(this);
