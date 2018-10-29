(function() {
  var bodyRe, headRe, htmlRe, inject, rewriteHtml, security;

  inject = require("./inject");

  security = require("./security");

  headRe = /(<head.*?>)/i;

  bodyRe = /(<body.*?>)/i;

  htmlRe = /(<html.*?>)/i;

  rewriteHtml = function(html, domainName, wantsInjection, modifyObstructiveCode) {
    var htmlToInject, replace;
    replace = function(re, str) {
      return html.replace(re, str);
    };
    htmlToInject = (function(_this) {
      return function() {
        switch (wantsInjection) {
          case "full":
            return inject.full(domainName);
          case "partial":
            return inject.partial(domainName);
        }
      };
    })(this)();
    if (modifyObstructiveCode) {
      html = security.strip(html);
    }
    switch (false) {
      case !headRe.test(html):
        return replace(headRe, "$1 " + htmlToInject);
      case !bodyRe.test(html):
        return replace(bodyRe, "<head> " + htmlToInject + " </head> $1");
      case !htmlRe.test(html):
        return replace(htmlRe, "$1 <head> " + htmlToInject + " </head>");
      default:
        return ("<head> " + htmlToInject + " </head>") + html;
    }
  };

  module.exports = {
    html: rewriteHtml,
    security: security.stripStream
  };

}).call(this);
