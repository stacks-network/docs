"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var log_1 = require("./log");
var lodash_1 = require("lodash");
var cp = require("child_process");
var browserNotFoundErr = function (browsers, name) {
    var available = lodash_1.map(browsers, 'name').join(', ');
    var err = new Error("Browser: '" + name + "' not found. Available browsers are: [" + available + "]");
    err.specificBrowserNotFound = true;
    return err;
};
/** list of the browsers we can detect and use by default */
exports.browsers = [
    {
        name: 'chrome',
        displayName: 'Chrome',
        versionRegex: /Google Chrome (\S+)/,
        profile: true,
        binary: 'google-chrome'
    },
    {
        name: 'chromium',
        displayName: 'Chromium',
        versionRegex: /Chromium (\S+)/,
        profile: true,
        binary: 'chromium-browser'
    },
    {
        name: 'canary',
        displayName: 'Canary',
        versionRegex: /Google Chrome Canary (\S+)/,
        profile: true,
        binary: 'google-chrome-canary'
    }
];
/** starts a browser by name and opens URL if given one */
function launch(browsers, name, url, args) {
    if (args === void 0) { args = []; }
    log_1.log('launching browser %s to open %s', name, url);
    var browser = lodash_1.find(browsers, { name: name });
    if (!browser) {
        throw browserNotFoundErr(browsers, name);
    }
    if (!browser.path) {
        throw new Error("Found browser " + name + " is missing path");
    }
    if (url) {
        args = [url].concat(args);
    }
    log_1.log('spawning browser %s with args %s', browser.path, args.join(' '));
    return cp.spawn(browser.path, args, { stdio: 'ignore' });
}
exports.launch = launch;
