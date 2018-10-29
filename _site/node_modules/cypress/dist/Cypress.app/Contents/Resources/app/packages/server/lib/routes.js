(function() {
  var CacheBuster, check, client, cwd, debug, driver, files, la, logger, path, proxy, reporter, runner, spec, staticCtrl, xhrs;

  path = require("path");

  la = require("lazy-ass");

  check = require("check-more-types");

  debug = require("debug")("cypress:server:routes");

  CacheBuster = require("./util/cache_buster");

  cwd = require("./cwd");

  logger = require("./logger");

  spec = require("./controllers/spec");

  reporter = require("./controllers/reporter");

  runner = require("./controllers/runner");

  xhrs = require("./controllers/xhrs");

  client = require("./controllers/client");

  files = require("./controllers/files");

  proxy = require("./controllers/proxy");

  driver = require("./controllers/driver");

  staticCtrl = require("./controllers/static");

  module.exports = function(app, config, request, getRemoteState, project) {
    app.get("/__cypress/tests", function(req, res, next) {
      var test;
      test = CacheBuster.strip(req.query.p);
      return spec.handle(test, req, res, config, next, project);
    });
    app.get("/__cypress/socket.io.js", function(req, res) {
      return client.handle(req, res);
    });
    app.get("/__cypress/reporter/*", function(req, res) {
      return reporter.handle(req, res);
    });
    app.get("/__cypress/runner/*", function(req, res) {
      return runner.handle(req, res);
    });
    app.get("/__cypress/driver/*", function(req, res) {
      return driver.handle(req, res);
    });
    app.get("/__cypress/static/*", function(req, res) {
      return staticCtrl.handle(req, res);
    });
    app.get("/__cypress/files", function(req, res) {
      return files.handleFiles(req, res, config);
    });
    app.get("/__cypress/iframes/*", function(req, res) {
      return files.handleIframe(req, res, config, getRemoteState);
    });
    app.all("/__cypress/xhrs/*", function(req, res, next) {
      return xhrs.handle(req, res, config, next);
    });
    app.get("/__root/*", function(req, res, next) {
      var file;
      file = path.join(config.projectRoot, req.params[0]);
      return res.sendFile(file, {
        etag: false
      });
    });
    la(check.unemptyString(config.clientRoute), "missing client route in config", config);
    app.get(config.clientRoute, function(req, res) {
      debug("Serving Cypress front-end by requested URL:", req.url);
      return runner.serve(req, res, config, getRemoteState);
    });
    app.all("*", function(req, res, next) {
      return proxy.handle(req, res, config, getRemoteState, request);
    });
    return app.use(function(err, req, res, next) {
      console.log(err.stack);
      res.set("x-cypress-error", err.message);
      res.set("x-cypress-stack", JSON.stringify(err.stack));
      return res.sendStatus(500);
    });
  };

}).call(this);
