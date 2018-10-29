(function() {
  var Promise, app, base, cwd, env, os, pkg, ref;

  require("./util/http_overrides");

  require("./fs_warn")(require("fs-extra"));

  os = require("os");

  cwd = require("./cwd");

  Promise = require("bluebird");

  Error.stackTraceLimit = 2e308;

  pkg = require("@packages/root");

  try {
    app = require("electron").app;
    app.commandLine.appendSwitch("disable-renderer-backgrounding", true);
    app.commandLine.appendSwitch("ignore-certificate-errors", true);
    if (os.platform() === "linux") {
      app.disableHardwareAcceleration();
    }
  } catch (error) {}

  env = (base = process.env)["CYPRESS_ENV"] || (base["CYPRESS_ENV"] = (ref = pkg.env) != null ? ref : "development");

  Promise.config({
    cancellation: true,
    longStackTraces: env === "development"
  });

  module.exports = env;

}).call(this);
