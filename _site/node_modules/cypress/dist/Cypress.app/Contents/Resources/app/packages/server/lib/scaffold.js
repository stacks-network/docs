(function() {
  var INTEGRATION_EXAMPLE_NAME, INTEGRATION_EXAMPLE_SPEC, Promise, _, always, complement, compose, cwd, cypressEx, equals, fs, glob, head, integrationExampleSize, isDefault, isEmpty, isFileNameChanged, isFileNameDefault, isNewProject, isNotOneFile, isOneFile, log, numberOfExampleSpecs, path, propEq, ref;

  _ = require("lodash");

  fs = require("fs-extra");

  Promise = require("bluebird");

  path = require("path");

  cypressEx = require("@packages/example");

  glob = require("glob");

  cwd = require("./cwd");

  log = require("debug")("cypress:server:scaffold");

  ref = require("ramda"), propEq = ref.propEq, complement = ref.complement, equals = ref.equals, compose = ref.compose, head = ref.head, isEmpty = ref.isEmpty, always = ref.always;

  isDefault = require("./util/config").isDefault;

  glob = Promise.promisify(glob);

  fs = Promise.promisifyAll(fs);

  INTEGRATION_EXAMPLE_SPEC = cypressEx.getPathToExample();

  INTEGRATION_EXAMPLE_NAME = path.basename(INTEGRATION_EXAMPLE_SPEC);

  numberOfExampleSpecs = 1;

  isOneFile = propEq('length', numberOfExampleSpecs);

  isNotOneFile = complement(isOneFile);

  isFileNameDefault = compose(equals(INTEGRATION_EXAMPLE_NAME), path.basename);

  isFileNameChanged = function(filename) {
    return !isFileNameDefault(filename);
  };

  integrationExampleSize = function() {
    return fs.statAsync(INTEGRATION_EXAMPLE_SPEC).get("size");
  };

  isNewProject = function(integrationFolder) {
    var getCurrentSize;
    getCurrentSize = function(file) {
      return fs.statAsync(file).get("size");
    };
    return glob("**/*", {
      cwd: integrationFolder,
      realpath: true
    }).then(function(files) {
      var exampleSpec;
      log("found " + files.length + " files in folder " + integrationFolder);
      if (isEmpty(files)) {
        return true;
      }
      if (isNotOneFile(files)) {
        return false;
      }
      exampleSpec = head(files);
      log("Checking spec filename if default " + exampleSpec);
      if (isFileNameChanged(exampleSpec)) {
        return false;
      }
      log("Checking spec file size " + exampleSpec);
      return Promise.join(getCurrentSize(exampleSpec), integrationExampleSize(), equals);
    });
  };

  module.exports = {
    isNewProject: isNewProject,
    integration: function(folder, config) {
      log("integration folder " + folder);
      if (!isDefault(config, "integrationFolder")) {
        return Promise.resolve();
      }
      return this.verifyScaffolding(folder, (function(_this) {
        return function() {
          log("copying examples into " + folder);
          return _this._copy(INTEGRATION_EXAMPLE_SPEC, folder, config);
        };
      })(this));
    },
    fixture: function(folder, config) {
      log("fixture folder " + folder);
      if (!config.fixturesFolder || !isDefault(config, "fixturesFolder")) {
        return Promise.resolve();
      }
      return this.verifyScaffolding(folder, (function(_this) {
        return function() {
          log("copying example.json into " + folder);
          return _this._copy("fixtures/example.json", folder, config);
        };
      })(this));
    },
    support: function(folder, config) {
      log("support folder " + folder + ", support file " + config.supportFile);
      if (!config.supportFile || !isDefault(config, "supportFile")) {
        return Promise.resolve();
      }
      return this.verifyScaffolding(folder, (function(_this) {
        return function() {
          log("copying commands.js and index.js to " + folder);
          return Promise.join(_this._copy("support/commands.js", folder, config), _this._copy("support/index.js", folder, config));
        };
      })(this));
    },
    plugins: function(folder, config) {
      log("plugins folder " + folder);
      if (!config.pluginsFile || !isDefault(config, "pluginsFile")) {
        return Promise.resolve();
      }
      return this.verifyScaffolding(folder, (function(_this) {
        return function() {
          log("copying index.js into " + folder);
          return _this._copy("plugins/index.js", folder, config);
        };
      })(this));
    },
    _copy: function(file, folder, config) {
      var dest, src;
      src = path.resolve(cwd("lib", "scaffold"), file);
      dest = path.join(folder, path.basename(file));
      this._assertInFileTree(dest, config);
      return fs.copyAsync(src, dest);
    },
    integrationExampleSize: integrationExampleSize,
    integrationExampleName: always(INTEGRATION_EXAMPLE_NAME),
    verifyScaffolding: function(folder, fn) {
      log("verify scaffolding in " + folder);
      return fs.statAsync(folder).then(function() {
        return log("folder " + folder + " already exists");
      })["catch"]((function(_this) {
        return function() {
          log("missing folder " + folder);
          return fn.call(_this);
        };
      })(this));
    },
    fileTree: function(config) {
      var files, getFilePath;
      if (config == null) {
        config = {};
      }
      getFilePath = function(dir, name) {
        return path.relative(config.projectRoot, path.join(dir, name));
      };
      files = [getFilePath(config.integrationFolder, "example_spec.js")];
      if (config.fixturesFolder) {
        files = files.concat([getFilePath(config.fixturesFolder, "example.json")]);
      }
      if (config.supportFolder && config.supportFile !== false) {
        files = files.concat([getFilePath(config.supportFolder, "commands.js"), getFilePath(config.supportFolder, "index.js")]);
      }
      if (config.pluginsFile) {
        files = files.concat([getFilePath(path.dirname(config.pluginsFile), "index.js")]);
      }
      log("scaffolded files %j", files);
      return this._fileListToTree(files);
    },
    _fileListToTree: function(files) {
      return _.reduce(files, function(tree, file) {
        var parts, placeholder;
        placeholder = tree;
        parts = file.split("/");
        _.each(parts, function(part, index) {
          var entry;
          if (!(entry = _.find(placeholder, {
            name: part
          }))) {
            entry = {
              name: part
            };
            if (index < parts.length - 1) {
              entry.children = [];
            }
            placeholder.push(entry);
          }
          return placeholder = entry.children;
        });
        return tree;
      }, []);
    },
    _assertInFileTree: function(filePath, config) {
      var relativeFilePath;
      relativeFilePath = path.relative(config.projectRoot, filePath);
      if (!this._inFileTree(this.fileTree(config), relativeFilePath)) {
        throw new Error("You attempted to scaffold a file, '" + relativeFilePath + "', that's not in the scaffolded file tree. This is because you added, removed, or changed a scaffolded file. Make sure to update scaffold#fileTree to match your changes.");
      }
    },
    _inFileTree: function(fileTree, filePath) {
      var branch, found, i, len, part, parts;
      branch = fileTree;
      parts = filePath.split("/");
      for (i = 0, len = parts.length; i < len; i++) {
        part = parts[i];
        if (found = _.find(branch, {
          name: part
        })) {
          branch = found.children;
        } else {
          return false;
        }
      }
      return true;
    }
  };

}).call(this);
