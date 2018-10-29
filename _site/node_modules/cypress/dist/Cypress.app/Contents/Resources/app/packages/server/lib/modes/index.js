(function() {
  module.exports = function(mode, options) {
    switch (mode) {
      case "record":
        return require("./record").run(options);
      case "headless":
        return require("./headless").run(options);
      case "headed":
        return require("./headed").run(options);
    }
  };

}).call(this);
