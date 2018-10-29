(function() {
  var _, debug, os, pkg, runner, send;

  _ = require("lodash");

  send = require("send");

  os = require("os");

  debug = require("debug")("cypress:server");

  runner = require("@packages/runner");

  pkg = require("@packages/root");

  module.exports = {
    serve: function(req, res, config, getRemoteState) {
      config = _.clone(config);
      config.remote = getRemoteState();
      config.version = pkg.version;
      config.platform = os.platform();
      config.arch = os.arch();
      debug("config version %s platform %s arch %s", config.version, config.platform, config.arch);
      return res.render(runner.getPathToIndex(), {
        config: JSON.stringify(config),
        projectName: config.projectName
      });
    },
    handle: function(req, res) {
      var pathToFile;
      pathToFile = runner.getPathToDist(req.params[0]);
      return send(req, pathToFile).pipe(res);
    }
  };

}).call(this);
