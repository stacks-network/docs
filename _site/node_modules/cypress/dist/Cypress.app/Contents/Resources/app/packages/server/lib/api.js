(function() {
  var Promise, Routes, _, browsers, debug, errors, formatResponseBody, machineId, nmi, os, pkg, request, rp, system, tagError;

  _ = require("lodash");

  os = require("os");

  nmi = require("node-machine-id");

  request = require("request-promise");

  errors = require("request-promise/errors");

  Promise = require("bluebird");

  pkg = require("@packages/root");

  browsers = require('./browsers');

  Routes = require("./util/routes");

  system = require("./util/system");

  debug = require("debug")("cypress:server:api");

  rp = request.defaults(function(params, callback) {
    var headers, method;
    if (params == null) {
      params = {};
    }
    headers = params.headers != null ? params.headers : params.headers = {};
    _.defaults(headers, {
      "x-platform": os.platform(),
      "x-cypress-version": pkg.version
    });
    method = params.method.toLowerCase();
    return request[method](params, callback);
  });

  formatResponseBody = function(err) {
    var body;
    if (_.isObject(err.error)) {
      body = JSON.stringify(err.error, null, 2);
      err.message = [err.statusCode, body].join("\n\n");
    }
    throw err;
  };

  tagError = function(err) {
    err.isApiError = true;
    throw err;
  };

  machineId = function() {
    return nmi.machineId()["catch"](function() {
      return null;
    });
  };

  module.exports = {
    ping: function() {
      return rp.get(Routes.ping())["catch"](tagError);
    },
    getOrgs: function(authToken) {
      return rp.get({
        url: Routes.orgs(),
        json: true,
        auth: {
          bearer: authToken
        }
      })["catch"](tagError);
    },
    getProjects: function(authToken) {
      return rp.get({
        url: Routes.projects(),
        json: true,
        auth: {
          bearer: authToken
        }
      })["catch"](tagError);
    },
    getProject: function(projectId, authToken) {
      return rp.get({
        url: Routes.project(projectId),
        json: true,
        auth: {
          bearer: authToken
        },
        headers: {
          "x-route-version": "2"
        }
      })["catch"](tagError);
    },
    getProjectRuns: function(projectId, authToken, options) {
      var ref;
      if (options == null) {
        options = {};
      }
      if (options.page == null) {
        options.page = 1;
      }
      return rp.get({
        url: Routes.projectRuns(projectId),
        json: true,
        timeout: (ref = options.timeout) != null ? ref : 10000,
        auth: {
          bearer: authToken
        }
      })["catch"](errors.StatusCodeError, formatResponseBody)["catch"](tagError);
    },
    createRun: function(options) {
      var body, debugReturnedBuild, ref;
      if (options == null) {
        options = {};
      }
      debugReturnedBuild = function(info) {
        debug("received API response with buildId %s", info.buildId);
        return debug("and list of specs to run", info.specs);
      };
      body = _.pick(options, ["projectId", "recordKey", "commitSha", "commitBranch", "commitAuthorName", "commitAuthorEmail", "commitMessage", "remoteOrigin", "ciParams", "ciProvider", "ciBuildNumber", "groupId", "specs", "specPattern"]);
      debug("creating project run");
      debug("project '%s' group id '%s'", body.projectId, body.groupId);
      return rp.post({
        url: Routes.runs(),
        json: true,
        timeout: (ref = options.timeout) != null ? ref : 10000,
        headers: {
          "x-route-version": "2"
        },
        body: body
      }).promise().tap(debugReturnedBuild).get("buildId")["catch"](errors.StatusCodeError, formatResponseBody)["catch"](tagError);
    },
    createInstance: function(options) {
      var buildId, spec, timeout;
      if (options == null) {
        options = {};
      }
      buildId = options.buildId, spec = options.spec, timeout = options.timeout;
      return browsers.getByName(options.browser).then(function(browser) {
        var displayName, version;
        if (browser == null) {
          browser = {};
        }
        displayName = browser.displayName, version = browser.version;
        return system.info().then(function(systemInfo) {
          systemInfo.spec = spec;
          systemInfo.browserName = displayName;
          systemInfo.browserVersion = version;
          return rp.post({
            url: Routes.instances(buildId),
            json: true,
            timeout: timeout != null ? timeout : 10000,
            headers: {
              "x-route-version": "3"
            },
            body: systemInfo
          }).promise().get("instanceId")["catch"](errors.StatusCodeError, formatResponseBody)["catch"](tagError);
        });
      });
    },
    updateInstanceStdout: function(options) {
      var ref;
      if (options == null) {
        options = {};
      }
      return rp.put({
        url: Routes.instanceStdout(options.instanceId),
        json: true,
        timeout: (ref = options.timeout) != null ? ref : 10000,
        body: {
          stdout: options.stdout
        }
      })["catch"](errors.StatusCodeError, formatResponseBody)["catch"](tagError);
    },
    updateInstance: function(options) {
      var ref;
      if (options == null) {
        options = {};
      }
      return rp.put({
        url: Routes.instance(options.instanceId),
        json: true,
        timeout: (ref = options.timeout) != null ? ref : 10000,
        body: _.pick(options, ["tests", "duration", "passes", "failures", "pending", "error", "video", "screenshots", "failingTests", "ciProvider", "cypressConfig", "stdout"])
      })["catch"](errors.StatusCodeError, formatResponseBody)["catch"](tagError);
    },
    createRaygunException: function(body, authToken, timeout) {
      if (timeout == null) {
        timeout = 3000;
      }
      return rp.post({
        url: Routes.exceptions(),
        json: true,
        body: body,
        auth: {
          bearer: authToken
        }
      }).promise().timeout(timeout)["catch"](tagError);
    },
    createSignin: function(code) {
      return machineId().then(function(id) {
        var h;
        h = {
          "x-route-version": "3",
          "x-accept-terms": "true"
        };
        if (id) {
          h["x-machine-id"] = id;
        }
        return rp.post({
          url: Routes.signin({
            code: code
          }),
          json: true,
          headers: h
        })["catch"](errors.StatusCodeError, function(err) {
          err.message = err.error;
          throw err;
        })["catch"](tagError);
      });
    },
    createSignout: function(authToken) {
      return rp.post({
        url: Routes.signout(),
        json: true,
        auth: {
          bearer: authToken
        }
      })["catch"]({
        statusCode: 401
      }, function() {})["catch"](tagError);
    },
    createProject: function(projectDetails, remoteOrigin, authToken) {
      return rp.post({
        url: Routes.projects(),
        json: true,
        auth: {
          bearer: authToken
        },
        headers: {
          "x-route-version": "2"
        },
        body: {
          name: projectDetails.projectName,
          orgId: projectDetails.orgId,
          "public": projectDetails["public"],
          remoteOrigin: remoteOrigin
        }
      })["catch"](errors.StatusCodeError, formatResponseBody)["catch"](tagError);
    },
    getProjectRecordKeys: function(projectId, authToken) {
      return rp.get({
        url: Routes.projectRecordKeys(projectId),
        json: true,
        auth: {
          bearer: authToken
        }
      })["catch"](tagError);
    },
    requestAccess: function(projectId, authToken) {
      return rp.post({
        url: Routes.membershipRequests(projectId),
        json: true,
        auth: {
          bearer: authToken
        }
      })["catch"](errors.StatusCodeError, formatResponseBody)["catch"](tagError);
    },
    getLoginUrl: function() {
      return rp.get({
        url: Routes.auth(),
        json: true
      }).promise().get("url")["catch"](tagError);
    },
    _projectToken: function(method, projectId, authToken) {
      return rp({
        method: method,
        url: Routes.projectToken(projectId),
        json: true,
        auth: {
          bearer: authToken
        },
        headers: {
          "x-route-version": "2"
        }
      }).promise().get("apiToken")["catch"](tagError);
    },
    getProjectToken: function(projectId, authToken) {
      return this._projectToken("get", projectId, authToken);
    },
    updateProjectToken: function(projectId, authToken) {
      return this._projectToken("put", projectId, authToken);
    }
  };

}).call(this);
