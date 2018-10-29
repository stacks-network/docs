(function() {
  var Project, Promise, _, api, chalk, check, ciProvider, commitInfo, debug, errors, headless, la, logException, logger, os, stdout, terminal, upload;

  _ = require("lodash");

  os = require("os");

  chalk = require("chalk");

  Promise = require("bluebird");

  headless = require("./headless");

  api = require("../api");

  logger = require("../logger");

  errors = require("../errors");

  stdout = require("../stdout");

  upload = require("../upload");

  Project = require("../project");

  terminal = require("../util/terminal");

  ciProvider = require("../util/ci_provider");

  debug = require("debug")("cypress:server");

  commitInfo = require("@cypress/commit-info");

  la = require("lazy-ass");

  check = require("check-more-types");

  logException = function(err) {
    return logger.createException(err).timeout(1000)["catch"](function() {});
  };

  module.exports = {
    generateProjectBuildId: function(projectId, projectPath, projectName, recordKey, group, groupId, specPattern) {
      if (!recordKey) {
        errors["throw"]("RECORD_KEY_MISSING");
      }
      if (groupId && !group) {
        console.log("Warning: you passed group-id but no group flag");
      }
      la(check.maybe.unemptyString(specPattern), "invalid spec pattern", specPattern);
      debug("generating build id for project %s at %s", projectId, projectPath);
      return Promise.all([commitInfo.commitInfo(projectPath), Project.findSpecs(projectPath, specPattern)]).spread(function(git, specs) {
        var createRunOptions;
        debug("git information");
        debug(git);
        if (specPattern) {
          debug("spec pattern", specPattern);
        }
        debug("project specs");
        debug(specs);
        la(check.maybe.strings(specs), "invalid list of specs to run", specs);
        if (group) {
          if (groupId == null) {
            groupId = ciProvider.groupId();
          }
        } else {
          groupId = null;
        }
        createRunOptions = {
          projectId: projectId,
          recordKey: recordKey,
          commitSha: git.sha,
          commitBranch: git.branch,
          commitAuthorName: git.author,
          commitAuthorEmail: git.email,
          commitMessage: git.message,
          remoteOrigin: git.remote,
          ciParams: ciProvider.params(),
          ciProvider: ciProvider.name(),
          ciBuildNumber: ciProvider.buildNum(),
          groupId: groupId,
          specs: specs,
          specPattern: specPattern
        };
        return api.createRun(createRunOptions)["catch"](function(err) {
          switch (err.statusCode) {
            case 401:
              recordKey = recordKey.slice(0, 5) + "..." + recordKey.slice(-5);
              return errors["throw"]("RECORD_KEY_NOT_VALID", recordKey, projectId);
            case 404:
              return errors["throw"]("DASHBOARD_PROJECT_NOT_FOUND", projectId);
            default:
              errors.warning("DASHBOARD_CANNOT_CREATE_RUN_OR_INSTANCE", err);
              return logException(err)["return"](null);
          }
        });
      });
    },
    createInstance: function(buildId, spec, browser) {
      return api.createInstance({
        buildId: buildId,
        spec: spec,
        browser: browser
      })["catch"](function(err) {
        errors.warning("DASHBOARD_CANNOT_CREATE_RUN_OR_INSTANCE", err);
        if (err.statusCode !== 503) {
          return logException(err)["return"](null);
        } else {
          return null;
        }
      });
    },
    upload: function(options) {
      var count, nums, screenshotUrls, screenshots, send, uploadVideo, uploads, video, videoUrl;
      if (options == null) {
        options = {};
      }
      video = options.video, uploadVideo = options.uploadVideo, screenshots = options.screenshots, videoUrl = options.videoUrl, screenshotUrls = options.screenshotUrls;
      uploads = [];
      count = 0;
      nums = function() {
        count += 1;
        return chalk.gray("(" + count + "/" + uploads.length + ")");
      };
      send = function(pathToFile, url) {
        var fail, success;
        success = function() {
          return console.log("  - Done Uploading " + (nums()), chalk.blue(pathToFile));
        };
        fail = function(err) {
          return console.log("  - Failed Uploading " + (nums()), chalk.red(pathToFile));
        };
        return uploads.push(upload.send(pathToFile, url).then(success)["catch"](fail));
      };
      if (videoUrl && uploadVideo) {
        send(video, videoUrl);
      }
      if (screenshotUrls) {
        screenshotUrls.forEach(function(obj) {
          var screenshot;
          screenshot = _.find(screenshots, {
            clientId: obj.clientId
          });
          return send(screenshot.path, obj.uploadUrl);
        });
      }
      if (!uploads.length) {
        console.log("  - Nothing to Upload");
      }
      return Promise.all(uploads)["catch"](function(err) {
        errors.warning("DASHBOARD_CANNOT_UPLOAD_RESULTS", err);
        return logException(err);
      });
    },
    uploadAssets: function(instanceId, stats, stdout) {
      var screenshots;
      console.log("");
      console.log("");
      terminal.header("Uploading Assets", {
        color: ["blue"]
      });
      console.log("");
      screenshots = _.map(stats.screenshots, function(screenshot) {
        return _.omit(screenshot, "path");
      });
      return api.updateInstance({
        instanceId: instanceId,
        tests: stats.tests,
        passes: stats.passes,
        failures: stats.failures,
        pending: stats.pending,
        duration: stats.duration,
        error: stats.error,
        video: !!stats.video,
        screenshots: screenshots,
        failingTests: stats.failingTests,
        cypressConfig: stats.config,
        ciProvider: ciProvider.name(),
        stdout: stdout
      }).then((function(_this) {
        return function(resp) {
          if (resp == null) {
            resp = {};
          }
          return _this.upload({
            video: stats.video,
            uploadVideo: stats.shouldUploadVideo,
            screenshots: stats.screenshots,
            videoUrl: resp.videoUploadUrl,
            screenshotUrls: resp.screenshotUploadUrls
          });
        };
      })(this))["catch"](function(err) {
        errors.warning("DASHBOARD_CANNOT_CREATE_RUN_OR_INSTANCE", err);
        if (err.statusCode !== 503) {
          return logException(err)["return"](null);
        } else {
          return null;
        }
      });
    },
    uploadStdout: function(instanceId, stdout) {
      return api.updateInstanceStdout({
        instanceId: instanceId,
        stdout: stdout
      })["catch"](function(err) {
        errors.warning("DASHBOARD_CANNOT_CREATE_RUN_OR_INSTANCE", err);
        if (err.statusCode !== 503) {
          return logException(err);
        }
      });
    },
    run: function(options) {
      var browser, captured, projectPath, type;
      projectPath = options.projectPath, browser = options.browser;
      if (browser == null) {
        browser = "electron";
      }
      captured = stdout.capture();
      if (options.ci) {
        type = (function() {
          switch (false) {
            case !process.env.CYPRESS_CI_KEY:
              return "CYPRESS_CI_DEPRECATED_ENV_VAR";
            default:
              return "CYPRESS_CI_DEPRECATED";
          }
        })();
        errors.warning(type);
      }
      return Project.add(projectPath).then(function() {
        return Project.id(projectPath)["catch"](function() {
          return errors["throw"]("CANNOT_RECORD_NO_PROJECT_ID");
        });
      }).then((function(_this) {
        return function(projectId) {
          options.projectId = projectId;
          return Project.config(projectPath).then(function(cfg) {
            var key, projectName, ref;
            projectName = cfg.projectName;
            key = (ref = options.key) != null ? ref : process.env.CYPRESS_RECORD_KEY || process.env.CYPRESS_CI_KEY;
            return _this.generateProjectBuildId(projectId, projectPath, projectName, key, options.group, options.groupId, options.spec).then(function(buildId) {
              if (!buildId) {
                return;
              }
              return _this.createInstance(buildId, options.spec, browser);
            }).then(function(instanceId) {
              var didUploadAssets;
              options.ensureAuthToken = false;
              options.allDone = false;
              didUploadAssets = false;
              return headless.run(options).then(function(stats) {
                if (stats == null) {
                  stats = {};
                }
                if (instanceId) {
                  return _this.uploadAssets(instanceId, stats, captured.toString()).then(function(ret) {
                    return didUploadAssets = ret !== null;
                  })["return"](stats)["finally"](function() {
                    headless.allDone();
                    if (didUploadAssets) {
                      stdout.restore();
                      return _this.uploadStdout(instanceId, captured.toString());
                    }
                  });
                } else {
                  stdout.restore();
                  headless.allDone();
                  return stats;
                }
              });
            });
          });
        };
      })(this));
    }
  };

}).call(this);
