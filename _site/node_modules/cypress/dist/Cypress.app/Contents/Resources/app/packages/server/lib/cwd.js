(function() {
  var appPath, path,
    slice = [].slice;

  path = require("path");

  appPath = (function() {
    if (path.basename(__dirname) === "lib") {
      return path.join(__dirname, "..");
    } else {
      return __dirname;
    }
  })();

  if (process.cwd() !== appPath) {
    process.chdir(appPath);
  }

  module.exports = function() {
    var args;
    args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    return path.join.apply(path, [appPath].concat(slice.call(args)));
  };

}).call(this);
