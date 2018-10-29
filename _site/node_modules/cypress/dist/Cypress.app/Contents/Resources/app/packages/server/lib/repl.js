(function() {
  var Fixtures, _, browsers, getObj, history, path, repl, replServer, req, setContext;

  require("./environment");

  _ = require("lodash");

  path = require("path");

  repl = require("repl");

  history = require("repl.history");

  browsers = require("./browsers");

  Fixtures = require("../test/support/helpers/fixtures");

  replServer = repl.start({
    prompt: "> "
  });

  history(replServer, path.join(process.env.HOME, ".node_history"));

  req = replServer.context.require;

  getObj = function() {
    var deploy;
    deploy = require("../deploy");
    return {
      lodash: _,
      deploy: deploy,
      darwin: deploy.getPlatform("darwin"),
      linux: deploy.getPlatform("linux"),
      Fixtures: Fixtures,
      browsers: browsers,
      reload: function() {
        var key;
        for (key in require.cache) {
          delete require.cache[key];
        }
        for (key in req.cache) {
          delete req.cache[key];
        }
        return setContext();
      },
      r: function(file) {
        return require(file);
      }
    };
  };

  (setContext = function() {
    return _.extend(replServer.context, getObj());
  })();

}).call(this);
