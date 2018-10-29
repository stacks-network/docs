(function() {
  var _, buildNums, getProviderName, groupIds, isCodeship, isGitlab, isWercker, params, providers;

  _ = require("lodash");

  isCodeship = function() {
    return process.env.CI_NAME && process.env.CI_NAME === "codeship";
  };

  isGitlab = function() {
    return process.env.GITLAB_CI || process.env.CI_SERVER_NAME && process.env.CI_SERVER_NAME === "GitLab CI";
  };

  isWercker = function() {
    return process.env.WERCKER || process.env.WERCKER_MAIN_PIPELINE_STARTED;
  };

  providers = {
    "appveyor": "APPVEYOR",
    "bamboo": "bamboo_planKey",
    "buildkite": "BUILDKITE",
    "circle": "CIRCLECI",
    "codeship": isCodeship,
    "drone": "DRONE",
    "gitlab": isGitlab,
    "hudson": "HUDSON_URL",
    "jenkins": "JENKINS_URL",
    "semaphore": "SEMAPHORE",
    "shippable": "SHIPPABLE",
    "snap": "SNAP_CI",
    "teamcity": "TEAMCITY_VERSION",
    "teamfoundation": "TF_BUILD",
    "travis": "TRAVIS",
    "wercker": isWercker
  };

  buildNums = function(provider) {
    return {
      appveyor: process.env.APPVEYOR_BUILD_NUMBER,
      circle: process.env.CIRCLE_BUILD_NUM,
      codeship: process.env.CI_BUILD_NUMBER,
      gitlab: process.env.CI_BUILD_ID,
      jenkins: process.env.BUILD_NUMBER,
      travis: process.env.TRAVIS_BUILD_NUMBER
    }[provider];
  };

  groupIds = function(provider) {
    return {
      circle: process.env.CIRCLE_WORKFLOW_ID
    }[provider];
  };

  params = function(provider) {
    return {
      appveyor: {
        accountName: process.env.APPVEYOR_ACCOUNT_NAME,
        projectSlug: process.env.APPVEYOR_PROJECT_SLUG,
        buildVersion: process.env.APPVEYOR_BUILD_VERSION
      },
      circle: {
        buildUrl: process.env.CIRCLE_BUILD_URL
      },
      codeship: {
        buildUrl: process.env.CI_BUILD_URL
      },
      gitlab: {
        buildId: process.env.CI_BUILD_ID,
        projectUrl: process.env.CI_PROJECT_URL
      },
      jenkins: {
        buildUrl: process.env.BUILD_URL
      },
      travis: {
        buildId: process.env.TRAVIS_BUILD_ID,
        repoSlug: process.env.TRAVIS_REPO_SLUG
      }
    }[provider];
  };

  getProviderName = function() {
    var name;
    name = _.findKey(providers, function(value, key) {
      switch (false) {
        case !_.isString(value):
          return process.env[value];
        case !_.isFunction(value):
          return value();
      }
    });
    return name || "unknown";
  };

  module.exports = {
    name: function() {
      return getProviderName();
    },
    params: function() {
      var ref;
      return (ref = params(getProviderName())) != null ? ref : null;
    },
    buildNum: function() {
      var ref;
      return (ref = buildNums(getProviderName())) != null ? ref : null;
    },
    groupId: function() {
      var ref;
      return (ref = groupIds(getProviderName())) != null ? ref : null;
    }
  };

}).call(this);
