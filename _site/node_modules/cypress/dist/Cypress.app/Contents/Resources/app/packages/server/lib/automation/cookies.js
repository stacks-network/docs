(function() {
  var COOKIE_PROPERTIES, Promise, _, cookies, extension, normalizeCookieProps, normalizeCookies;

  _ = require("lodash");

  Promise = require("bluebird");

  extension = require("@packages/extension");

  COOKIE_PROPERTIES = "name value path domain secure httpOnly expiry".split(" ");

  normalizeCookies = function(cookies, includeHostOnly) {
    return _.map(cookies, function(c) {
      return normalizeCookieProps(c, includeHostOnly);
    });
  };

  normalizeCookieProps = function(props, includeHostOnly) {
    var cookie;
    if (!props) {
      return props;
    }
    cookie = _.chain(props, COOKIE_PROPERTIES).pick(COOKIE_PROPERTIES).omitBy(_.isUndefined).value();
    if (includeHostOnly) {
      cookie.hostOnly = props.hostOnly;
    }
    switch (false) {
      case props.expiry == null:
        delete cookie.expiry;
        cookie.expirationDate = props.expiry;
        break;
      case props.expirationDate == null:
        delete cookie.expirationDate;
        delete cookie.url;
        cookie.expiry = props.expirationDate;
    }
    return cookie;
  };

  cookies = function(cyNamespace, cookieNamespace) {
    var isNamespaced;
    isNamespaced = function(cookie) {
      var name;
      if (!(name = cookie != null ? cookie.name : void 0)) {
        return cookie;
      }
      return name.startsWith(cyNamespace) || name === cookieNamespace;
    };
    return {
      getCookies: function(data, automate) {
        var includeHostOnly;
        includeHostOnly = data.includeHostOnly;
        delete data.includeHostOnly;
        return automate(data).then(function(cookies) {
          return normalizeCookies(cookies, includeHostOnly);
        }).then(function(cookies) {
          return _.reject(cookies, isNamespaced);
        });
      },
      getCookie: function(data, automate) {
        return automate(data).then(function(cookie) {
          if (isNamespaced(cookie)) {
            throw new Error("Sorry, you cannot get a Cypress namespaced cookie.");
          } else {
            return cookie;
          }
        }).then(normalizeCookieProps);
      },
      setCookie: function(data, automate) {
        var cookie;
        if (isNamespaced(data)) {
          throw new Error("Sorry, you cannot set a Cypress namespaced cookie.");
        } else {
          cookie = normalizeCookieProps(data);
          cookie.url = extension.getCookieUrl(data);
          if (data.hostOnly) {
            cookie = _.omit(cookie, "domain");
          }
          return automate(cookie).then(normalizeCookieProps);
        }
      },
      clearCookie: function(data, automate) {
        if (isNamespaced(data)) {
          throw new Error("Sorry, you cannot clear a Cypress namespaced cookie.");
        } else {
          return automate(data).then(normalizeCookieProps);
        }
      },
      clearCookies: function(data, automate) {
        var clear;
        cookies = _.reject(normalizeCookies(data), isNamespaced);
        clear = function(cookie) {
          return automate("clear:cookie", {
            name: cookie.name
          }).then(normalizeCookieProps);
        };
        return Promise.map(cookies, clear);
      },
      changeCookie: function(data) {
        var c, msg;
        c = normalizeCookieProps(data.cookie);
        if (isNamespaced(c)) {
          return;
        }
        msg = data.removed ? "Cookie Removed: '" + c.name + "'" : "Cookie Set: '" + c.name + "'";
        return {
          cookie: c,
          message: msg,
          removed: data.removed
        };
      }
    };
  };

  cookies.normalizeCookies = normalizeCookies;

  cookies.normalizeCookieProps = normalizeCookieProps;

  module.exports = cookies;

}).call(this);
