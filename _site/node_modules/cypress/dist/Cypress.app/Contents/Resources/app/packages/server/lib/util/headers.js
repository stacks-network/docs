(function() {
  var contentType;

  contentType = require("content-type");

  module.exports = {
    getContentType: function(res, type) {
      var err;
      try {
        return contentType.parse(res).type;
      } catch (error) {
        err = error;
        return null;
      }
    },
    hasContentType: function(res, type) {
      var err;
      try {
        return contentType.parse(res).type === type;
      } catch (error) {
        err = error;
        return false;
      }
    }
  };

}).call(this);
