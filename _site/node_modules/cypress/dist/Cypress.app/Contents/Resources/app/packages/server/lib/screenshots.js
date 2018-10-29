(function() {
  var Promise, RUNNABLE_SEPARATOR, bytes, dataUriToBuffer, fs, glob, invalidCharsRe, mime, path, sizeOf;

  fs = require("fs-extra");

  mime = require("mime");

  path = require("path");

  glob = require("glob");

  bytes = require("bytes");

  sizeOf = require("image-size");

  Promise = require("bluebird");

  dataUriToBuffer = require("data-uri-to-buffer");

  fs = Promise.promisifyAll(fs);

  glob = Promise.promisify(glob);

  RUNNABLE_SEPARATOR = " -- ";

  invalidCharsRe = /[^0-9a-zA-Z-_\s]/g;

  module.exports = {
    copy: function(src, dest) {
      return fs.copyAsync(src, dest, {
        overwrite: true
      })["catch"]({
        code: "ENOENT"
      }, function() {});
    },
    get: function(screenshotsFolder) {
      screenshotsFolder = path.join(screenshotsFolder, "**", "*");
      return glob(screenshotsFolder, {
        nodir: true
      });
    },
    save: function(data, dataUrl, screenshotsFolder) {
      var buffer, name, pathToScreenshot, ref;
      buffer = dataUriToBuffer(dataUrl);
      name = (ref = data.name) != null ? ref : data.titles.join(RUNNABLE_SEPARATOR);
      name = name.replace(invalidCharsRe, "");
      name = [name, mime.extension(buffer.type)].join(".");
      pathToScreenshot = path.join(screenshotsFolder, name);
      return fs.outputFileAsync(pathToScreenshot, buffer).then(function() {
        return fs.statAsync(pathToScreenshot).get("size");
      }).then(function(size) {
        var dimensions;
        dimensions = sizeOf(buffer);
        return {
          size: bytes(size, {
            unitSeparator: " "
          }),
          path: pathToScreenshot,
          width: dimensions.width,
          height: dimensions.height
        };
      });
    }
  };

}).call(this);
