(function() {
  var Promise, fs, path;

  fs = require("fs-extra");

  path = require("path");

  Promise = require("bluebird");

  fs = Promise.promisifyAll(fs);

  module.exports = {
    readFile: function(projectRoot, file, options) {
      var filePath, readFn;
      if (options == null) {
        options = {};
      }
      filePath = path.join(projectRoot, file);
      readFn = path.extname(filePath) === ".json" ? fs.readJsonAsync : fs.readFileAsync;
      return readFn(filePath, options.encoding || "utf8").then(function(contents) {
        return {
          contents: contents,
          filePath: filePath
        };
      })["catch"](function(err) {
        err.filePath = filePath;
        throw err;
      });
    },
    writeFile: function(projectRoot, file, contents, options) {
      var filePath;
      if (options == null) {
        options = {};
      }
      filePath = path.join(projectRoot, file);
      return fs.outputFileAsync(filePath, contents, options.encoding || "utf8").then(function() {
        return {
          contents: contents,
          filePath: filePath
        };
      })["catch"](function(err) {
        err.filePath = filePath;
        throw err;
      });
    }
  };

}).call(this);
