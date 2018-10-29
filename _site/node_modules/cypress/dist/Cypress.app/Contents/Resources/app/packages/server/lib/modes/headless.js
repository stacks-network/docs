(function() {
  var Project, Promise, Reporter, TITLE_SEPARATOR, Windows, _, chalk, collectTestResults, debug, errors, fs, haveProjectIdAndKeyButNoRecordOption, human, humanTime, openProject, path, pkg, progress, random, ss, stats, terminal, trash, user, uuid, video;

  _ = require("lodash");

  fs = require("fs-extra");

  uuid = require("uuid");

  path = require("path");

  chalk = require("chalk");

  human = require("human-interval");

  Promise = require("bluebird");

  random = require("randomstring");

  pkg = require("@packages/root");

  debug = require("debug")("cypress:server:headless");

  ss = require("../screenshots");

  user = require("../user");

  stats = require("../stats");

  video = require("../video");

  errors = require("../errors");

  Project = require("../project");

  Reporter = require("../reporter");

  openProject = require("../open_project");

  progress = require("../util/progress_bar");

  trash = require("../util/trash");

  terminal = require("../util/terminal");

  humanTime = require("../util/human_time");

  Windows = require("../gui/windows");

  fs = Promise.promisifyAll(fs);

  TITLE_SEPARATOR = " /// ";

  haveProjectIdAndKeyButNoRecordOption = function(projectId, options) {
    return (projectId && options.key) && (_.isUndefined(options.record) && _.isUndefined(options.ci));
  };

  collectTestResults = function(obj) {
    return {
      tests: obj.tests,
      passes: obj.passes,
      pending: obj.pending,
      failures: obj.failures,
      duration: humanTime(obj.duration),
      screenshots: obj.screenshots && obj.screenshots.length,
      video: !!obj.video,
      version: pkg.version
    };
  };

  module.exports = {
    collectTestResults: collectTestResults,
    getId: function() {
      return random.generate({
        length: 5,
        capitalization: "lowercase"
      });
    },
    getProjectId: function(project, id) {
      if (id) {
        return Promise.resolve(id);
      }
      return project.getProjectId()["catch"](function() {
        return null;
      });
    },
    openProject: function(id, options) {
      var ref;
      return openProject.create(options.projectPath, options, {
        morgan: false,
        socketId: id,
        report: true,
        isTextTerminal: (ref = options.isTextTerminal) != null ? ref : true,
        onError: function(err) {
          console.log();
          console.log(err.stack);
          return openProject.emit("exitEarlyWithErr", err.message);
        }
      })["catch"]({
        portInUse: true
      }, function(err) {
        return errors["throw"]("PORT_IN_USE_LONG", err.port);
      });
    },
    createRecording: function(name) {
      var outputDir;
      outputDir = path.dirname(name);
      return fs.ensureDirAsync(outputDir).then(function() {
        console.log("\nStarted video recording: " + (chalk.cyan(name)) + "\n");
        return video.start(name, {
          onError: function(err) {
            return errors.warning("VIDEO_RECORDING_FAILED", err.stack);
          }
        });
      });
    },
    getElectronProps: function(showGui, project, write) {
      var obj;
      obj = {
        width: 1280,
        height: 720,
        show: showGui,
        onCrashed: function() {
          var err;
          err = errors.get("RENDERER_CRASHED");
          errors.log(err);
          return project.emit("exitEarlyWithErr", err.message);
        },
        onNewWindow: function(e, url, frameName, disposition, options) {
          return options.show = false;
        }
      };
      if (write) {
        obj.recordFrameRate = 20;
        obj.onPaint = function(event, dirty, image) {
          return write(image.toJPEG(100));
        };
      }
      return obj;
    },
    displayStats: function(obj) {
      var bgColor, color;
      if (obj == null) {
        obj = {};
      }
      bgColor = obj.failures ? "bgRed" : "bgGreen";
      color = obj.failures ? "red" : "green";
      console.log("");
      terminal.header("Tests Finished", {
        color: [color]
      });
      console.log("");
      return stats.display(color, obj);
    },
    displayScreenshots: function(screenshots) {
      var format;
      if (screenshots == null) {
        screenshots = [];
      }
      console.log("");
      console.log("");
      terminal.header("Screenshots", {
        color: ["yellow"]
      });
      console.log("");
      format = function(s) {
        var dimensions;
        dimensions = chalk.gray("(" + s.width + "x" + s.height + ")");
        return "  - " + s.path + " " + dimensions;
      };
      return screenshots.forEach(function(screenshot) {
        return console.log(format(screenshot));
      });
    },
    postProcessRecording: function(end, name, cname, videoCompression, shouldUploadVideo) {
      debug("ending the video recording:", name);
      return end().then(function() {
        var onProgress, started, tenSecs;
        if (videoCompression === false || shouldUploadVideo === false) {
          return;
        }
        console.log("");
        console.log("");
        terminal.header("Video", {
          color: ["cyan"]
        });
        console.log("");
        console.log("  - Started processing:  ", chalk.cyan("Compressing to " + videoCompression + " CRF"));
        started = new Date;
        progress = Date.now();
        tenSecs = human("10 seconds");
        onProgress = function(float) {
          var duration, finished, percentage;
          switch (false) {
            case float !== 1:
              finished = new Date - started;
              duration = "(" + (humanTime(finished)) + ")";
              return console.log("  - Finished processing: ", chalk.cyan(name), chalk.gray(duration));
            case !((new Date - progress) > tenSecs):
              progress += tenSecs;
              percentage = Math.ceil(float * 100) + "%";
              return console.log("  - Compression progress: ", chalk.cyan(percentage));
          }
        };
        return video.process(name, cname, videoCompression, onProgress);
      })["catch"]({
        recordingVideoFailed: true
      }, function(err) {})["catch"](function(err) {
        return errors.warning("VIDEO_POST_PROCESSING_FAILED", err.stack);
      });
    },
    launchBrowser: function(options) {
      var browser, browserOpts, headed, project, screenshots, spec, write;
      if (options == null) {
        options = {};
      }
      browser = options.browser, spec = options.spec, write = options.write, headed = options.headed, project = options.project, screenshots = options.screenshots;
      headed = !!headed;
      if (browser == null) {
        browser = "electron";
      }
      browserOpts = (function() {
        switch (browser) {
          case "electron":
            return this.getElectronProps(headed, project, write);
          default:
            return {};
        }
      }).call(this);
      browserOpts.automationMiddleware = {
        onAfterResponse: (function(_this) {
          return function(message, data, resp) {
            if (message === "take:screenshot") {
              screenshots.push(_this.screenshotMetadata(data, resp));
            }
            return resp;
          };
        })(this)
      };
      browserOpts.projectPath = options.projectPath;
      return openProject.launch(browser, spec, browserOpts);
    },
    listenForProjectEnd: function(project, headed, exit) {
      return new Promise(function(resolve) {
        var onEarlyExit, onEnd;
        if (exit === false) {
          return;
        }
        onEarlyExit = function(errMsg) {
          var obj;
          obj = {
            error: errors.stripAnsi(errMsg),
            failures: 1,
            tests: 0,
            passes: 0,
            pending: 0,
            duration: 0,
            failingTests: []
          };
          return resolve(obj);
        };
        onEnd = (function(_this) {
          return function(obj) {
            return resolve(obj);
          };
        })(this);
        project.once("end", onEnd);
        return project.once("exitEarlyWithErr", onEarlyExit);
      });
    },
    waitForBrowserToConnect: function(options) {
      var attempts, id, project, timeout, waitForBrowserToConnect;
      if (options == null) {
        options = {};
      }
      project = options.project, id = options.id, timeout = options.timeout;
      attempts = 0;
      return (waitForBrowserToConnect = (function(_this) {
        return function() {
          return Promise.join(_this.waitForSocketConnection(project, id), _this.launchBrowser(options)).timeout(timeout != null ? timeout : 30000)["catch"](Promise.TimeoutError, function(err) {
            attempts += 1;
            console.log("");
            return openProject.closeBrowser().then(function() {
              var word;
              switch (attempts) {
                case 1:
                case 2:
                  word = attempts === 1 ? "Retrying..." : "Retrying again...";
                  errors.warning("TESTS_DID_NOT_START_RETRYING", word);
                  return waitForBrowserToConnect();
                default:
                  err = errors.get("TESTS_DID_NOT_START_FAILED");
                  errors.log(err);
                  return project.emit("exitEarlyWithErr", err.message);
              }
            });
          });
        };
      })(this))();
    },
    waitForSocketConnection: function(project, id) {
      return new Promise(function(resolve, reject) {
        var fn;
        fn = function(socketId) {
          if (socketId === id) {
            project.removeListener("socket:connected", fn);
            return resolve();
          }
        };
        return project.on("socket:connected", fn);
      });
    },
    waitForTestsToFinishRunning: function(options) {
      var cname, end, exit, headed, name, outputPath, project, screenshots, started, videoCompression, videoUploadOnPasses;
      if (options == null) {
        options = {};
      }
      project = options.project, headed = options.headed, screenshots = options.screenshots, started = options.started, end = options.end, name = options.name, cname = options.cname, videoCompression = options.videoCompression, videoUploadOnPasses = options.videoUploadOnPasses, outputPath = options.outputPath, exit = options.exit;
      return this.listenForProjectEnd(project, headed, exit).then((function(_this) {
        return function(obj) {
          var finish, ft, hasFailingTests, suv, testResults, writeOutput;
          if (end) {
            obj.video = name;
          }
          if (screenshots) {
            obj.screenshots = screenshots;
          }
          testResults = collectTestResults(obj);
          writeOutput = function() {
            if (!outputPath) {
              return Promise.resolve();
            }
            debug("saving results as %s", outputPath);
            return fs.outputJsonAsync(outputPath, testResults);
          };
          finish = function() {
            return writeOutput().then(function() {
              return project.getConfig();
            }).then(function(cfg) {
              return obj.config = cfg;
            })["return"](obj);
          };
          _this.displayStats(testResults);
          if (screenshots && screenshots.length) {
            _this.displayScreenshots(screenshots);
          }
          ft = obj.failingTests;
          hasFailingTests = ft && ft.length;
          if (hasFailingTests) {
            obj.failingTests = Reporter.setVideoTimestamp(started, ft);
          }
          suv = obj.shouldUploadVideo = !!(videoUploadOnPasses === true || hasFailingTests);
          debug("attempting to close the browser");
          return openProject.closeBrowser().then(function() {
            if (end) {
              return _this.postProcessRecording(end, name, cname, videoCompression, suv).then(finish);
            } else {
              return finish();
            }
          });
        };
      })(this));
    },
    trashAssets: function(options) {
      if (options == null) {
        options = {};
      }
      if (options.trashAssetsBeforeHeadlessRuns === true) {
        return Promise.join(trash.folder(options.videosFolder), trash.folder(options.screenshotsFolder))["catch"](function(err) {
          return errors.warning("CANNOT_TRASH_ASSETS", err.stack);
        });
      } else {
        return Promise.resolve();
      }
    },
    screenshotMetadata: function(data, resp) {
      return {
        clientId: uuid.v4(),
        title: data.name,
        testId: data.testId,
        testTitle: data.titles.join(TITLE_SEPARATOR),
        path: resp.path,
        height: resp.height,
        width: resp.width
      };
    },
    copy: function(videosFolder, screenshotsFolder) {
      return Promise["try"](function() {
        var ca, shouldCopy;
        shouldCopy = (ca = process.env.CIRCLE_ARTIFACTS) && process.env["COPY_CIRCLE_ARTIFACTS"] !== "false";
        debug("Should copy Circle Artifacts?", Boolean(shouldCopy));
        if (shouldCopy && videosFolder && screenshotsFolder) {
          debug("Copying Circle Artifacts", ca, videosFolder, screenshotsFolder);
          return Promise.join(ss.copy(screenshotsFolder, path.join(ca, path.basename(screenshotsFolder))), video.copy(videosFolder, path.join(ca, path.basename(videosFolder))));
        }
      });
    },
    allDone: function() {
      console.log("");
      console.log("");
      terminal.header("All Done", {
        color: ["gray"]
      });
      return console.log("");
    },
    runTests: function(options) {
      var browser, browserCanBeRecorded, cname, id2, name, recording, screenshots, videoRecording, videosFolder;
      if (options == null) {
        options = {};
      }
      browser = options.browser, videoRecording = options.videoRecording, videosFolder = options.videosFolder;
      debug("runTests with options", options);
      if (browser == null) {
        browser = "electron";
      }
      debug("runTests for browser " + browser);
      screenshots = [];
      browserCanBeRecorded = function(name) {
        return name === "electron" && !options.headed;
      };
      if (videoRecording) {
        if (browserCanBeRecorded(browser)) {
          if (!videosFolder) {
            throw new Error("Missing videoFolder for recording");
          }
          id2 = this.getId();
          name = path.join(videosFolder, id2 + ".mp4");
          cname = path.join(videosFolder, id2 + "-compressed.mp4");
          recording = this.createRecording(name);
        } else {
          if (browser === "electron" && options.headed) {
            errors.warning("CANNOT_RECORD_VIDEO_HEADED");
          } else {
            errors.warning("CANNOT_RECORD_VIDEO_FOR_THIS_BROWSER", browser);
          }
        }
      }
      return Promise.resolve(recording).then((function(_this) {
        return function(props) {
          var end, start, write;
          if (props == null) {
            props = {};
          }
          start = props.start, end = props.end, write = props.write;
          terminal.header("Tests Starting", {
            color: ["gray"]
          });
          return Promise.resolve(start).then(function(started) {
            return Promise.props({
              stats: _this.waitForTestsToFinishRunning({
                exit: options.exit,
                headed: options.headed,
                project: options.project,
                videoCompression: options.videoCompression,
                videoUploadOnPasses: options.videoUploadOnPasses,
                outputPath: options.outputPath,
                end: end,
                name: name,
                cname: cname,
                started: started,
                screenshots: screenshots
              }),
              connection: _this.waitForBrowserToConnect({
                id: options.id,
                spec: options.spec,
                headed: options.headed,
                project: options.project,
                webSecurity: options.webSecurity,
                projectPath: options.projectPath,
                write: write,
                browser: browser,
                screenshots: screenshots
              })
            });
          });
        };
      })(this));
    },
    ready: function(options) {
      var id, projectPath;
      if (options == null) {
        options = {};
      }
      debug("headless mode ready with options %j", options);
      id = this.getId();
      projectPath = options.projectPath;
      return Project.ensureExists(projectPath).then((function(_this) {
        return function() {
          return _this.openProject(id, options).call("getProject").then(function(project) {
            return Promise.all([_this.getProjectId(project, options.projectId), project.getConfig()]).spread(function(projectId, config) {
              if (haveProjectIdAndKeyButNoRecordOption(projectId, options)) {
                errors.warning("PROJECT_ID_AND_KEY_BUT_MISSING_RECORD_OPTION", projectId);
              }
              return _this.trashAssets(config).then(function() {
                return _this.runTests({
                  projectPath: projectPath,
                  id: id,
                  project: project,
                  videosFolder: config.videosFolder,
                  videoRecording: config.videoRecording,
                  videoCompression: config.videoCompression,
                  videoUploadOnPasses: config.videoUploadOnPasses,
                  exit: options.exit,
                  spec: options.spec,
                  headed: options.headed,
                  browser: options.browser,
                  outputPath: options.outputPath
                });
              }).get("stats")["finally"](function() {
                return _this.copy(config.videosFolder, config.screenshotsFolder).then(function() {
                  if (options.allDone !== false) {
                    return _this.allDone();
                  }
                });
              });
            });
          });
        };
      })(this));
    },
    run: function(options) {
      var app, waitForReady;
      app = require("electron").app;
      waitForReady = function() {
        return new Promise(function(resolve, reject) {
          return app.on("ready", resolve);
        });
      };
      return Promise.any([waitForReady(), Promise.delay(500)]).then((function(_this) {
        return function() {
          return _this.ready(options);
        };
      })(this));
    }
  };

}).call(this);
