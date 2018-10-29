(function() {
  var api, cache, errors;

  api = require("./api");

  cache = require("./cache");

  errors = require("./errors");

  module.exports = {
    get: function() {
      return cache.getUser();
    },
    set: function(user) {
      return cache.setUser(user);
    },
    getLoginUrl: function() {
      return api.getLoginUrl();
    },
    logIn: function(code) {
      return api.createSignin(code).then((function(_this) {
        return function(user) {
          return _this.set(user)["return"](user);
        };
      })(this));
    },
    logOut: function() {
      return this.get().then(function(user) {
        var authToken;
        authToken = user && user.authToken;
        return cache.removeUser().then(function() {
          if (authToken) {
            return api.createSignout(authToken);
          }
        });
      });
    },
    ensureAuthToken: function() {
      return this.get().then(function(user) {
        var at, error;
        if (user && (at = user.authToken)) {
          return at;
        } else {
          error = errors.get("NOT_LOGGED_IN");
          error.isApiError = true;
          throw error;
        }
      });
    }
  };

}).call(this);
