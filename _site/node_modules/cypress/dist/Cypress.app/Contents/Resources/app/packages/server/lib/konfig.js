(function() {
  var getConfig, konfig;

  require("./environment");

  konfig = require("konfig");

  getConfig = function() {
    var config, previousNodeEnv, previousNodeEnvExisted;
    previousNodeEnv = process.env["NODE_ENV"];
    previousNodeEnvExisted = process.env.hasOwnProperty("NODE_ENV");
    process.env["NODE_ENV"] = process.env["CYPRESS_ENV"];
    config = konfig().app;
    if (previousNodeEnvExisted) {
      process.env["NODE_ENV"] = previousNodeEnv;
    } else {
      delete process.env["NODE_ENV"];
    }
    return function(getter) {
      return config[getter];
    };
  };

  module.exports = getConfig();

}).call(this);
