(function() {
  var screenshots;

  screenshots = require("../screenshots");

  module.exports = function(screenshotsFolder) {
    return {
      capture: function(data, automate) {
        return automate(data).then(function(dataUrl) {
          return screenshots.save(data, dataUrl, screenshotsFolder);
        });
      }
    };
  };

}).call(this);
