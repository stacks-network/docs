(function() {
  var Promise, fs, r, rp;

  fs = require("fs-extra");

  r = require("request");

  rp = require("request-promise");

  Promise = require("bluebird");

  fs = Promise.promisifyAll(fs);

  module.exports = {
    send: function(pathToFile, url) {
      return fs.readFileAsync(pathToFile).then(function(buf) {
        return rp({
          url: url,
          method: "PUT",
          body: buf
        });
      });
    }
  };

}).call(this);
