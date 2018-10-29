(function() {
  var Promise, path, trash;

  path = require("path");

  trash = require("trash");

  Promise = require("bluebird");

  module.exports = {
    folder: function(pathToFolder) {
      return Promise.resolve(trash([pathToFolder]));
    }
  };

}).call(this);
