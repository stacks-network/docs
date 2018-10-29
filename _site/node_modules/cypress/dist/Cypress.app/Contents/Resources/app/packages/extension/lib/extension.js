(function() {
  var Promise, background, fs, path,
    slice = [].slice;

  fs = require("fs");

  path = require("path");

  Promise = require("bluebird");

  background = require("../app/background");

  fs = Promise.promisifyAll(fs);

  module.exports = {
    getPathToExtension: function() {
      var args;
      args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      args = [__dirname, "..", "dist"].concat(args);
      return path.join.apply(path, args);
    },
    getPathToTheme: function() {
      return path.join(__dirname, "..", "theme");
    },
    getPathToRoot: function() {
      return path.join(__dirname, "..");
    },
    setHostAndPath: function(host, path) {
      var src;
      src = this.getPathToExtension("background.js");
      return fs.readFileAsync(src, "utf8").then(function(str) {
        return str.replace("CHANGE_ME_HOST", host).replace("CHANGE_ME_PATH", path);
      });
    },
    getCookieUrl: background.getUrl,
    connect: background.connect,
    app: background
  };

}).call(this);
