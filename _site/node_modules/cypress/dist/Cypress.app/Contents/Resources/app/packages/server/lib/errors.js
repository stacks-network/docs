(function() {
  var API, Promise, _, ansi_up, chalk, listPaths, strip,
    hasProp = {}.hasOwnProperty;

  _ = require("lodash");

  strip = require("strip-ansi");

  chalk = require("chalk");

  ansi_up = require("ansi_up");

  Promise = require("bluebird");

  listPaths = function(paths) {
    return _.map(paths, function(p) {
      return "- " + chalk.yellow(p);
    });
  };

  API = {
    getMsgByType: function(type, arg1, arg2) {
      switch (type) {
        case "CANNOT_TRASH_ASSETS":
          return "Warning: We failed to trash the existing run results.\n\nThis error will not alter the exit code.\n\n" + arg1;
        case "VIDEO_RECORDING_FAILED":
          return "Warning: We failed to record the video.\n\nThis error will not alter the exit code.\n\n" + arg1;
        case "VIDEO_POST_PROCESSING_FAILED":
          return "Warning: We failed processing this video.\n\nThis error will not alter the exit code.\n\n" + arg1;
        case "BROWSER_NOT_FOUND":
          return "Browser: '" + arg1 + "' was not found on your system.\n\nAvailable browsers found are: " + arg2;
        case "CANNOT_RECORD_VIDEO_HEADED":
          return "Warning: Cypress can only record videos when running headlessly.\n\nYou have set the 'electron' browser to run headed.\n\nA video will not be recorded when using this mode.";
        case "CANNOT_RECORD_VIDEO_FOR_THIS_BROWSER":
          return "Warning: Cypress can only record videos when using the built in 'electron' browser.\n\nYou have set the browser to: '" + arg1 + "'\n\nA video will not be recorded when using this browser.";
        case "NOT_LOGGED_IN":
          return "You're not logged in.\n\nRun `cypress open` to open the Desktop App and log in.";
        case "TESTS_DID_NOT_START_RETRYING":
          return "Timed out waiting for the browser to connect. " + arg1;
        case "TESTS_DID_NOT_START_FAILED":
          return "The browser never connected. Something is wrong. The tests cannot run. Aborting...";
        case "RECORD_KEY_MISSING":
          return "You passed the --record flag but did not provide us your Record Key.\n\nYou can pass us your Record Key like this:\n\n  " + (chalk.blue("cypress run --record --key <record_key>")) + "\n\nYou can also set the key as an environment variable with the name CYPRESS_RECORD_KEY.\n\nhttps://on.cypress.io/how-do-i-record-runs";
        case "CANNOT_RECORD_NO_PROJECT_ID":
          return "You passed the --record flag but this project has not been setup to record.\n\nThis project is missing the 'projectId' inside of 'cypress.json'.\n\nWe cannot uniquely identify this project without this id.\n\nYou need to setup this project to record. This will generate a unique 'projectId'.\n\nAlternatively if you omit the --record flag this project will run without recording.\n\nhttps://on.cypress.io/recording-project-runs";
        case "PROJECT_ID_AND_KEY_BUT_MISSING_RECORD_OPTION":
          return "This project has been configured to record runs on our Dashboard.\n\nIt currently has the projectId: " + (chalk.green(arg1)) + "\n\nYou also provided your Record Key, but you did not pass the --record flag.\n\nThis run will not be recorded.\n\nIf you meant to have this run recorded please additionally pass this flag.\n\n  " + (chalk.blue("cypress run --record")) + "\n\nIf you don't want to record these runs, you can silence this warning:\n\n  " + (chalk.yellow("cypress run --record false")) + "\n\nhttps://on.cypress.io/recording-project-runs";
        case "CYPRESS_CI_DEPRECATED":
          return "You are using the deprecated command: " + (chalk.yellow("cypress ci <key>")) + "\n\nPlease switch and use: " + (chalk.blue("cypress run --record --key <record_key>")) + "\n\nhttps://on.cypress.io/cypress-ci-deprecated";
        case "CYPRESS_CI_DEPRECATED_ENV_VAR":
          return "1. You are using the deprecated command: " + (chalk.yellow("cypress ci")) + "\n\n   Please switch and use: " + (chalk.blue("cypress run --record")) + "\n\n2. You are also using the environment variable: " + (chalk.yellow("CYPRESS_CI_KEY")) + "\n\n   Please rename this environment variable to: " + (chalk.blue("CYPRESS_RECORD_KEY")) + "\n\nhttps://on.cypress.io/cypress-ci-deprecated";
        case "DASHBOARD_CANNOT_UPLOAD_RESULTS":
          return "Warning: We encountered an error while uploading results from your run.\n\nThese results will not be recorded.\n\nThis error will not alter or the exit code.\n\n" + arg1;
        case "DASHBOARD_CANNOT_CREATE_RUN_OR_INSTANCE":
          return "Warning: We encountered an error talking to our servers.\n\nThis run will not be recorded.\n\nThis error will not alter the exit code.\n\n" + arg1;
        case "RECORD_KEY_NOT_VALID":
          return "We failed trying to authenticate this project.\n\nYour Record Key is invalid: " + (chalk.yellow(arg1)) + "\n\nIt may have been recently revoked by you or another user.\n\nPlease log into the Dashboard to see the updated token.\n\nhttps://on.cypress.io/dashboard/projects/" + arg2;
        case "DASHBOARD_PROJECT_NOT_FOUND":
          return "We could not find a project with the ID: " + (chalk.yellow(arg1)) + "\n\nThis projectId came from your cypress.json file or an environment variable.\n\nPlease log into the Dashboard and find your project.\n\nWe will list the correct projectId in the 'Settings' tab.\n\nAlternatively, you can create a new project using the Desktop Application.\n\nhttps://on.cypress.io/dashboard";
        case "NO_PROJECT_ID":
          return "Can't find 'projectId' in the 'cypress.json' file for this project: " + chalk.blue(arg1);
        case "NO_PROJECT_FOUND_AT_PROJECT_ROOT":
          return "Can't find project at the path: " + chalk.blue(arg1);
        case "CANNOT_FETCH_PROJECT_TOKEN":
          return "Can't find project's secret key.";
        case "CANNOT_CREATE_PROJECT_TOKEN":
          return "Can't create project's secret key.";
        case "PORT_IN_USE_SHORT":
          return "Port '" + arg1 + "' is already in use.";
        case "PORT_IN_USE_LONG":
          return "Can't run project because port is currently in use: " + (chalk.blue(arg1)) + "\n\n" + (chalk.yellow("Assign a different port with the '--port <port>' argument or shut down the other running process."));
        case "ERROR_READING_FILE":
          return "Error reading from: " + (chalk.blue(arg1)) + "\n\n" + (chalk.yellow(arg2));
        case "ERROR_WRITING_FILE":
          return "Error writing to: " + (chalk.blue(arg1)) + "\n\n" + (chalk.yellow(arg2));
        case "SPEC_FILE_NOT_FOUND":
          return "Can't find test spec: " + chalk.blue(arg1);
        case "RENDERER_CRASHED":
          return "We detected that the Chromium Renderer process just crashed.\n\nThis is the equivalent to seeing the 'sad face' when Chrome dies.\n\nThis can happen for a number of different reasons:\n\n- You wrote an endless loop and you must fix your own code\n- There is a memory leak in Cypress (unlikely but possible)\n- You are running Docker (there is an easy fix for this: see link below)\n- You are running lots of tests on a memory intense application\n- You are running in a memory starved VM environment\n- There are problems with your GPU / GPU drivers\n- There are browser bugs in Chromium\n\nYou can learn more including how to fix Docker here:\n\nhttps://on.cypress.io/renderer-process-crashed";
        case "NO_CURRENTLY_OPEN_PROJECT":
          return "Can't find open project.";
        case "AUTOMATION_SERVER_DISCONNECTED":
          return "The automation client disconnected. Cannot continue running tests.";
        case "SUPPORT_FILE_NOT_FOUND":
          return "The support file is missing or invalid.\n\nYour supportFile is set to '" + arg1 + "', but either the file is missing or it's invalid. The supportFile must be a .js or .coffee file or, if you're using a preprocessor plugin, it must be supported by that plugin.\n\nCorrect your cypress.json, create the appropriate file, or set supportFile to false if a support file is not necessary for your project.\n\nLearn more at https://on.cypress.io/support-file-missing-or-invalid";
        case "PLUGINS_FILE_ERROR":
          return ("The plugins file is missing or invalid.\n\nYour pluginsFile is set to '" + arg1 + "', but either the file is missing, it contains a syntax error, or threw an error when required. The pluginsFile must be a .js or .coffee file.\n\nPlease fix this, or set 'pluginsFile' to 'false' if a plugins file is not necessary for your project.\n\n" + (arg2 ? "The following error was thrown:" : "") + "\n\n" + (arg2 ? chalk.yellow(arg2) : "")).trim();
        case "PLUGINS_DIDNT_EXPORT_FUNCTION":
          return "The pluginsFile must export a function.\n\nWe loaded the pluginsFile from: " + arg1 + "\n\nIt exported:\n\n" + (JSON.stringify(arg2));
        case "PLUGINS_FUNCTION_ERROR":
          return ("The function exported by the plugins file threw an error.\n\nWe invoked the function exported by '" + arg1 + "', but it threw an error.\n\nThe following error was thrown:\n\n" + (chalk.yellow(arg2))).trim();
        case "PLUGINS_ERROR":
          return ("The following error was thrown by a plugin. We've stopped running your tests because a plugin crashed.\n\n" + (chalk.yellow(arg1))).trim();
        case "BUNDLE_ERROR":
          return "Oops...we found an error preparing this test file:\n\n  " + (chalk.blue(arg1)) + "\n\nThe error was:\n\n" + (chalk.yellow(arg2)) + "\n\nThis occurred while Cypress was compiling and bundling your test code. This is usually caused by:\n\n- A missing file or dependency\n- A syntax error in the file or one of its dependencies\n\nFix the error in your code and re-run your tests.";
        case "CONFIG_VALIDATION_ERROR":
          return "We found an invalid value in the file: '" + (chalk.blue(arg1)) + "'\n\n" + (chalk.yellow(arg2));
        case "CANNOT_CONNECT_BASE_URL":
          return "Cypress could not verify that the server set as your 'baseUrl' is running:\n\n  > " + (chalk.blue(arg1)) + "\n\nYour tests likely make requests to this 'baseUrl' and these tests will fail if you don't boot your server.\n\nPlease start this server and then run Cypress again.";
        case "CANNOT_CONNECT_BASE_URL_WARNING":
          return "Cypress could not verify that the server set as your 'baseUrl' is running: " + arg1 + "\n\nYour tests likely make requests to this 'baseUrl' and these tests will fail if you don't boot your server.";
        case "INVALID_REPORTER_NAME":
          return "Could not load reporter by name: " + (chalk.yellow(arg1)) + "\n\nWe searched for the reporter in these paths:\n\n" + (listPaths(arg2).join("\n")) + "\n\nLearn more at https://on.cypress.io/reporters";
        case "PROJECT_DOES_NOT_EXIST":
          return "Could not find any tests to run.\n\nWe looked but did not find a " + (chalk.blue('cypress.json')) + " file in this folder: " + (chalk.blue(arg1));
      }
    },
    get: function(type, arg1, arg2) {
      var err, msg;
      msg = this.getMsgByType(type, arg1, arg2);
      err = new Error(msg);
      err.type = type;
      return err;
    },
    isCypressErr: function(err) {
      return err.type && this.getMsgByType(err.type);
    },
    warning: function(type, arg) {
      var err;
      err = this.get(type, arg);
      return this.log(err, "magenta");
    },
    log: function(err, color) {
      if (color == null) {
        color = "red";
      }
      return Promise["try"]((function(_this) {
        return function() {
          console.log(chalk[color](err.message));
          if (_this.isCypressErr(err)) {
            return;
          }
          console.log(chalk[color](err.stack));
          if (process.env["CYPRESS_ENV"] === "production") {
            return require("./logger").createException(err)["catch"](function() {});
          }
        };
      })(this));
    },
    "throw": function(type, arg1, arg2) {
      throw this.get(type, arg1, arg2);
    },
    stripAnsi: strip,
    clone: function(err, options) {
      var obj, prop, val;
      if (options == null) {
        options = {};
      }
      _.defaults(options, {
        html: false
      });
      obj = _.pick(err, "type", "name", "stack", "fileName", "lineNumber", "columnNumber");
      if (options.html) {
        obj.message = ansi_up.ansi_to_html(err.message, {
          use_classes: true
        });
      } else {
        obj.message = err.message;
      }
      for (prop in err) {
        if (!hasProp.call(err, prop)) continue;
        val = err[prop];
        obj[prop] = val;
      }
      return obj;
    }
  };

  module.exports = _.bindAll(API, _.functions(API));

}).call(this);
