(function() {
  var Promise, R, execa, loadShellVars, log, pickMainProps, shellEnv, trimStdio, utils;

  Promise = require("bluebird");

  execa = require("execa");

  R = require("ramda");

  shellEnv = require("shell-env");

  log = require("./log");

  utils = require("./util/shell");

  pickMainProps = R.pick(["stdout", "stderr", "code"]);

  trimStdio = R.evolve({
    stdout: R.trim,
    stderr: R.trim
  });

  loadShellVars = R.memoize(shellEnv);

  module.exports = {
    run: function(projectRoot, options) {
      var cmd, run, shellCommand;
      cmd = options.cmd;
      shellCommand = function(cmd, cwd, env, shell) {
        log("cy.exec found shell", shell);
        log("and is running command:", options.cmd);
        log("in folder:", projectRoot);
        return execa.shell(cmd, {
          cwd: cwd,
          env: env,
          shell: shell
        }).then(function(result) {
          result.shell = shell;
          result.cmd = cmd;
          return result;
        }).then(pickMainProps)["catch"](pickMainProps).then(trimStdio);
      };
      run = function() {
        return loadShellVars().then(function(shellVariables) {
          var env;
          env = R.mergeAll([{}, shellVariables, process.env, options.env]);
          return utils.getShell(env.SHELL).then(function(shell) {
            cmd = utils.sourceShellCommand(options.cmd, shell);
            return shellCommand(cmd, projectRoot, env, shell);
          });
        });
      };
      return Promise["try"](run).timeout(options.timeout)["catch"](Promise.TimeoutError, function() {
        var err, msg;
        msg = "Process timed out\ncommand: " + options.cmd;
        err = new Error(msg);
        err.timedout = true;
        throw err;
      });
    }
  };

}).call(this);
