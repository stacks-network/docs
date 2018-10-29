(function() {
  module.exports = {
    isDefault: function(config, prop) {
      return config.resolved[prop].from === "default";
    }
  };

}).call(this);
