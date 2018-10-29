(function() {
  var convertNewLinesToBr;

  convertNewLinesToBr = function(text) {
    return text.split("\n").join("<br />");
  };

  module.exports = {
    http: function(err, url) {
      return "Cypress errored attempting to make an http request to this url:\n\n" + url + "\n\n\nThe error was:\n\n" + err.message + "\n\n\nThe stack trace was:\n\n" + err.stack;
    },
    file: function(url, status) {
      return "Cypress errored trying to serve this file from your system:\n\n" + url + "\n\n" + (status === 404 ? "The file was not found." : "");
    },
    wrap: function(contents) {
      return "<!DOCTYPE html>\n<html>\n<body>\n  " + (convertNewLinesToBr(contents)) + "\n</body>\n</html>";
    },
    get: function(err, url, status, strategy) {
      var contents;
      contents = (function() {
        switch (strategy) {
          case "http":
            return this.http(err, url);
          case "file":
            return this.file(url, status);
        }
      }).call(this);
      return this.wrap(contents);
    }
  };

}).call(this);
