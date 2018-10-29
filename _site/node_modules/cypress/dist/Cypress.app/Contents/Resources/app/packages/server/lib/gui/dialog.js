(function() {
  var dialog;

  dialog = require("electron").dialog;

  module.exports = {
    show: function() {
      var props;
      props = {
        properties: ["openDirectory"]
      };
      return new Promise(function(resolve, reject) {
        return dialog.showOpenDialog(props, function(paths) {
          if (paths == null) {
            paths = [];
          }
          return process.nextTick(function() {
            return resolve(paths[0]);
          });
        });
      });
    }
  };

}).call(this);
