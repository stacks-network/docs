(function() {
  var EE, PrettyError, Promise, _, appData, baseEmitter, clientSideError, cwd, errorMessage, fileObjects, fileProcessors, getOutputPath, log, path, pe, plugins, savedState, setDefaultPreprocessor;

  _ = require("lodash");

  EE = require("events");

  path = require("path");

  log = require("debug")("cypress:server:preprocessor");

  Promise = require("bluebird");

  appData = require("../util/app_data");

  cwd = require("../cwd");

  plugins = require("../plugins");

  savedState = require("../util/saved_state");

  PrettyError = require("pretty-error");

  pe = new PrettyError();

  pe.skipNodeFiles();

  errorMessage = function(err) {
    var ref, ref1, ref2;
    if (err == null) {
      err = {};
    }
    return ((ref = (ref1 = (ref2 = err.stack) != null ? ref2 : err.annotated) != null ? ref1 : err.message) != null ? ref : err.toString()).replace(/\n\s*at.*/g, "").replace(/From previous event:\n?/g, "");
  };

  clientSideError = function(err) {
    console.error(pe.render(err));
    err = errorMessage(err).replace(/\n/g, '{newline}').replace(/\[\d{1,3}m/g, '');
    return "(function () {\n  Cypress.action(\"spec:script:error\", {\n    type: \"BUNDLE_ERROR\",\n    error: " + (JSON.stringify(err)) + "\n  })\n}())";
  };

  getOutputPath = function(config, filePath) {
    return appData.projectsPath(savedState.toHashName(config.projectRoot), "bundles", filePath);
  };

  baseEmitter = new EE();

  fileObjects = {};

  fileProcessors = {};

  setDefaultPreprocessor = function() {
    var browserify;
    log("set default preprocessor");
    browserify = require("@cypress/browserify-preprocessor");
    return plugins.register("file:preprocessor", browserify());
  };

  plugins.registerHandler(function(ipc) {
    ipc.on("preprocessor:rerun", function(filePath) {
      log("ipc preprocessor:rerun event");
      return baseEmitter.emit("file:updated", filePath);
    });
    return baseEmitter.on("close", function(filePath) {
      log("base emitter plugin close event");
      return ipc.send("preprocessor:close", filePath);
    });
  });

  module.exports = {
    emitter: baseEmitter,
    errorMessage: errorMessage,
    clientSideError: clientSideError,
    getFile: function(filePath, config, options) {
      var fileObject, fileProcessor, preprocessor;
      if (options == null) {
        options = {};
      }
      filePath = path.join(config.projectRoot, filePath);
      log("getFile " + filePath);
      if (!(fileObject = fileObjects[filePath])) {
        fileObject = fileObjects[filePath] = _.extend(new EE(), {
          filePath: filePath,
          outputPath: getOutputPath(config, filePath.replace(config.projectRoot, "")),
          shouldWatch: !config.isTextTerminal
        });
        fileObject.on("rerun", function() {
          log("file object rerun event");
          return baseEmitter.emit("file:updated", filePath);
        });
        baseEmitter.once("close", function() {
          log("base emitter native close event");
          return fileObject.emit("close");
        });
      }
      if (!plugins.has("file:preprocessor")) {
        setDefaultPreprocessor(config);
      }
      if (config.isTextTerminal && (fileProcessor = fileProcessors[filePath])) {
        log("headless and already processed");
        return fileProcessor;
      }
      preprocessor = fileProcessors[filePath] = Promise["try"](function() {
        return plugins.execute("file:preprocessor", fileObject);
      });
      return preprocessor;
    },
    removeFile: function(filePath, config) {
      var fileObject;
      filePath = path.join(config.projectRoot, filePath);
      if (!fileProcessors[filePath]) {
        return;
      }
      log("removeFile " + filePath);
      baseEmitter.emit("close", filePath);
      if (fileObject = fileObjects[filePath]) {
        fileObject.emit("close");
      }
      delete fileObjects[filePath];
      return delete fileProcessors[filePath];
    },
    close: function() {
      log("close preprocessor");
      fileObjects = {};
      fileProcessors = {};
      baseEmitter.emit("close");
      return baseEmitter.removeAllListeners();
    }
  };

}).call(this);
