(function() {
  var Routes, UrlParse, _, api_url, konfig, parseArgs, routes,
    slice = [].slice;

  _ = require("lodash");

  UrlParse = require("url-parse");

  konfig = require("../konfig");

  api_url = konfig("api_url");

  routes = {
    api: "",
    auth: "auth",
    ping: "ping",
    signin: "signin",
    signout: "signout",
    runs: "builds",
    instances: "builds/:id/instances",
    instance: "instances/:id",
    instanceStdout: "instances/:id/stdout",
    orgs: "organizations",
    projects: "projects",
    project: "projects/:id",
    projectToken: "projects/:id/token",
    projectRuns: "projects/:id/builds",
    projectRecordKeys: "projects/:id/keys",
    exceptions: "exceptions",
    membershipRequests: "projects/:id/membership_requests"
  };

  parseArgs = function(url, args) {
    if (args == null) {
      args = [];
    }
    _.each(args, function(value) {
      switch (false) {
        case !_.isObject(value):
          return url.set("query", _.extend(url.query, value));
        case !(_.isString(value) || _.isNumber(value)):
          return url.set("pathname", url.pathname.replace(":id", value));
      }
    });
    return url;
  };

  Routes = _.reduce(routes, function(memo, value, key) {
    memo[key] = function() {
      var args, url;
      args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      url = new UrlParse(api_url, true);
      if (value) {
        url.set("pathname", value);
      }
      if (args.length) {
        url = parseArgs(url, args);
      }
      return url.toString();
    };
    return memo;
  }, {});

  module.exports = Routes;

}).call(this);
