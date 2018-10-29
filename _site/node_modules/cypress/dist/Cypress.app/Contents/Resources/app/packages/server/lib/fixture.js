(function() {
  var Promise, _, check, coffee, cwd, extensions, friendlyJsonParse, fs, jsonlint, lastCharacterIsNewLine, path, queue;

  _ = require("lodash");

  fs = require("fs-extra");

  path = require("path");

  check = require("syntax-error");

  coffee = require("../../../packages/coffee");

  Promise = require("bluebird");

  jsonlint = require("jsonlint");

  cwd = require("./cwd");

  fs = Promise.promisifyAll(fs);

  extensions = ".json .js .coffee .html .txt .csv .png .jpg .jpeg .gif .tif .tiff .zip".split(" ");

  queue = {};

  lastCharacterIsNewLine = function(str) {
    return str[str.length - 1] === "\n";
  };

  friendlyJsonParse = function(s) {
    jsonlint.parse(s);
    return JSON.parse(s);
  };

  module.exports = {
    get: function(fixturesFolder, filePath, options) {
      var ext, fixture, p, tryParsingFile;
      if (options == null) {
        options = {};
      }
      p = path.join(fixturesFolder, filePath);
      fixture = path.basename(p);
      if (ext = path.extname(p)) {
        return this.parseFile(p, fixture, ext, options);
      } else {
        tryParsingFile = (function(_this) {
          return function(index) {
            ext = extensions[index];
            if (!ext) {
              throw new Error("No fixture file found with an acceptable extension. Searched in: " + p);
            }
            return _this.fileExists(p + ext)["catch"](function() {
              return tryParsingFile(index + 1);
            }).then(function() {
              return this.parseFile(p + ext, fixture, ext, options);
            });
          };
        })(this);
        return Promise.resolve(tryParsingFile(0));
      }
    },
    fileExists: function(p) {
      return fs.statAsync(p).bind(this);
    },
    parseFile: function(p, fixture, ext, options) {
      var cleanup;
      if (queue[p]) {
        return Promise.delay(1).then((function(_this) {
          return function() {
            return _this.parseFile(p, fixture, ext);
          };
        })(this));
      } else {
        queue[p] = true;
        cleanup = function() {
          return delete queue[p];
        };
        return this.fileExists(p)["catch"](function(err) {
          throw new Error("No fixture exists at: " + p);
        }).then(function() {
          return this.parseFileByExtension(p, fixture, ext, options);
        }).then(function(ret) {
          cleanup();
          return ret;
        })["catch"](function(err) {
          cleanup();
          throw err;
        });
      }
    },
    parseFileByExtension: function(p, fixture, ext, options) {
      if (options == null) {
        options = {};
      }
      if (ext == null) {
        ext = path.extname(fixture);
      }
      switch (ext) {
        case ".json":
          return this.parseJson(p, fixture);
        case ".js":
          return this.parseJs(p, fixture);
        case ".coffee":
          return this.parseCoffee(p, fixture);
        case ".html":
          return this.parseHtml(p, fixture);
        case ".png":
        case ".jpg":
        case ".jpeg":
        case ".gif":
        case ".tif":
        case ".tiff":
        case ".zip":
          return this.parse(p, fixture, options.encoding || "base64");
        default:
          return this.parse(p, fixture, options.encoding);
      }
    },
    parseJson: function(p, fixture) {
      return fs.readFileAsync(p, "utf8").bind(this).then(friendlyJsonParse)["catch"](function(err) {
        throw new Error("'" + fixture + "' is not valid JSON.\n" + err.message);
      });
    },
    parseJs: function(p, fixture) {
      return fs.readFileAsync(p, "utf8").bind(this).then(function(str) {
        var e, err, obj;
        try {
          obj = eval("(" + str + ")");
        } catch (error) {
          e = error;
          err = check(str, fixture);
          if (err) {
            throw err;
          }
          throw e;
        }
        return obj;
      })["catch"](function(err) {
        throw new Error("'" + fixture + "' is not a valid JavaScript object." + (err.toString()));
      });
    },
    parseCoffee: function(p, fixture) {
      var dc;
      dc = process.env.NODE_DISABLE_COLORS;
      process.env.NODE_DISABLE_COLORS = "0";
      return fs.readFileAsync(p, "utf8").bind(this).then(function(str) {
        str = coffee.compile(str, {
          bare: true
        });
        return eval(str);
      })["catch"](function(err) {
        throw new Error("'" + fixture + " is not a valid CoffeeScript object.\n" + (err.toString()));
      })["finally"](function() {
        return process.env.NODE_DISABLE_COLORS = dc;
      });
    },
    parseHtml: function(p, fixture) {
      return fs.readFileAsync(p, "utf8").bind(this);
    },
    parse: function(p, fixture, encoding) {
      if (encoding == null) {
        encoding = "utf8";
      }
      return fs.readFileAsync(p, encoding).bind(this);
    }
  };

}).call(this);
