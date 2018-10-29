(function() {
  var Promise, fs, glob, idRe, path;

  fs = require("fs");

  path = require("path");

  glob = require("glob");

  Promise = require("bluebird");

  fs = Promise.promisifyAll(fs);

  idRe = /\s*\[.{3}\]/g;

  module.exports = {
    files: function(pathToTestFiles) {
      return new Promise(function(resolve, reject) {
        return glob(path.join(pathToTestFiles, "**", "*+(.js|.coffee)"), {
          nodir: true
        }, function(err, files) {
          if (err) {
            reject(err);
          }
          return resolve(files);
        });
      });
    },
    get: function(pathToTestFiles) {
      var getIds;
      getIds = function(memo, file) {
        return fs.readFileAsync(file, "utf8").then(function(contents) {
          var matches;
          if (matches = contents.match(idRe)) {
            memo = memo.concat(matches);
          }
          return memo;
        });
      };
      return Promise.reduce(this.files(pathToTestFiles), getIds, []);
    },
    remove: function(pathToTestFiles) {
      var removeIds;
      removeIds = function(memo, file) {
        return fs.readFileAsync(file, "utf8").then(function(contents) {
          var matches;
          if (matches = contents.match(idRe)) {
            memo.ids += matches.length;
            memo.files += 1;
            contents = contents.replace(idRe, "");
            fs.writeFileAsync(file, contents);
          }
          return memo;
        });
      };
      return Promise.reduce(this.files(pathToTestFiles), removeIds, {
        ids: 0,
        files: 0
      });
    }
  };

}).call(this);
