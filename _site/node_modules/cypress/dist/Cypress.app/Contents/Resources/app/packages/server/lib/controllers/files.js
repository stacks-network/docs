(function() {
  var CacheBuster, Promise, _, api, cwd, errors, glob, log, minimatch, path, pathHelpers, user;

  _ = require("lodash");

  path = require("path");

  glob = require("glob");

  Promise = require("bluebird");

  minimatch = require("minimatch");

  cwd = require("../cwd");

  api = require("../api");

  user = require("../user");

  pathHelpers = require("../util/path_helpers");

  CacheBuster = require("../util/cache_buster");

  errors = require("../errors");

  log = require("debug")("cypress:server:files");

  glob = Promise.promisify(glob);

  module.exports = {
    handleFiles: function(req, res, config) {
      return this.getTestFiles(config).then(function(files) {
        return res.json(files);
      });
    },
    handleIframe: function(req, res, config, getRemoteState) {
      var iframePath, test;
      test = req.params[0];
      iframePath = cwd("lib", "html", "iframe.html");
      return this.getSpecs(test, config).then((function(_this) {
        return function(specs) {
          return _this.getJavascripts(config).then(function(js) {
            return res.render(iframePath, {
              title: _this.getTitle(test),
              domain: getRemoteState().domainName,
              javascripts: js,
              specs: specs
            });
          });
        };
      })(this));
    },
    getSpecs: function(spec, config) {
      var convertSpecPath, getSpecs;
      convertSpecPath = (function(_this) {
        return function(spec) {
          spec = pathHelpers.getAbsolutePathToSpec(spec, config);
          return _this.prepareForBrowser(spec, config.projectRoot);
        };
      })(this);
      getSpecs = (function(_this) {
        return function() {
          if (spec === "__all") {
            return _this.getTestFiles(config).get("integration").map(function(spec) {
              return spec.absolute;
            }).map(convertSpecPath);
          } else {
            return [convertSpecPath(spec)];
          }
        };
      })(this);
      return Promise["try"]((function(_this) {
        return function() {
          return getSpecs();
        };
      })(this));
    },
    prepareForBrowser: function(filePath, projectRoot) {
      filePath = path.relative(projectRoot, filePath);
      return this.getTestUrl(filePath);
    },
    getTestUrl: function(file) {
      file += CacheBuster.get();
      return "/__cypress/tests?p=" + file;
    },
    getTitle: function(test) {
      if (test === "__all") {
        return "All Tests";
      } else {
        return test;
      }
    },
    getJavascripts: function(config) {
      var files, javascripts, paths, projectRoot, supportFile;
      projectRoot = config.projectRoot, supportFile = config.supportFile, javascripts = config.javascripts;
      files = [].concat(javascripts);
      if (supportFile !== false) {
        files = [supportFile].concat(files);
      }
      paths = _.map(files, function(file) {
        return path.resolve(projectRoot, file);
      });
      return Promise.map(paths, function(p) {
        if (!glob.hasMagic(p)) {
          return p;
        }
        p = path.resolve(projectRoot, p);
        return glob(p, {
          nodir: true
        });
      }).then(_.flatten).map((function(_this) {
        return function(filePath) {
          return _this.prepareForBrowser(filePath, projectRoot);
        };
      })(this));
    },
    getTestFiles: function(config, specPattern) {
      var doesNotMatchAllIgnoredPatterns, fixturesFolderPath, ignorePatterns, integrationFolderPath, javascriptsPaths, matchesSpecPattern, options, relativePathFromIntegrationFolder, relativePathFromProjectRoot, setNameParts, supportFilePath;
      integrationFolderPath = config.integrationFolder;
      log("looking for test files in the integration folder %s", integrationFolderPath);
      log("specPattern for test files is", specPattern);
      if (config.fixturesFolder) {
        fixturesFolderPath = path.join(config.fixturesFolder, "**", "*");
      }
      supportFilePath = config.supportFile || [];
      javascriptsPaths = _.map(config.javascripts, function(js) {
        return path.join(config.projectRoot, js);
      });
      options = {
        sort: true,
        absolute: true,
        cwd: integrationFolderPath,
        ignore: _.compact(_.flatten([javascriptsPaths, supportFilePath, fixturesFolderPath]))
      };
      relativePathFromIntegrationFolder = function(file) {
        return path.relative(integrationFolderPath, file);
      };
      relativePathFromProjectRoot = function(file) {
        return path.relative(config.projectRoot, file);
      };
      setNameParts = function(file) {
        log("found test file %s", file);
        if (!path.isAbsolute(file)) {
          throw new Error("Cannot set parts of file from non-absolute path " + file);
        }
        return {
          name: relativePathFromIntegrationFolder(file),
          path: relativePathFromProjectRoot(file),
          absolute: file
        };
      };
      ignorePatterns = [].concat(config.ignoreTestFiles);
      doesNotMatchAllIgnoredPatterns = function(file) {
        return _.every(ignorePatterns, function(pattern) {
          return !minimatch(file, pattern, {
            dot: true,
            matchBase: true
          });
        });
      };
      matchesSpecPattern = function(file) {
        if (!specPattern) {
          return true;
        }
        return minimatch(file, specPattern, {
          dot: true,
          matchBase: true
        });
      };
      return glob(config.testFiles, options).filter(doesNotMatchAllIgnoredPatterns).filter(matchesSpecPattern).map(setNameParts).then(function(files) {
        log("found %d spec files", files.length);
        log(files);
        return {
          integration: files
        };
      });
    }
  };

}).call(this);
