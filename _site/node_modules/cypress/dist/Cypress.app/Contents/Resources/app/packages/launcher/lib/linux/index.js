"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var log_1 = require("../log");
var ramda_1 = require("ramda");
var execa = require("execa");
var notInstalledErr = function (name) {
    var err = new Error("Browser not installed: " + name);
    err.notInstalled = true;
    throw err;
};
function getLinuxBrowser(name, binary, versionRegex) {
    var getVersion = function (stdout) {
        var m = versionRegex.exec(stdout);
        if (m) {
            return m[1];
        }
        log_1.log('Could not extract version from %s using regex %s', stdout, versionRegex);
        return notInstalledErr(binary);
    };
    var returnError = function (err) {
        log_1.log('Could not detect browser %s', err.message);
        return notInstalledErr(binary);
    };
    var cmd = binary + " --version";
    log_1.log('looking using command "%s"', cmd);
    return execa
        .shell(cmd)
        .then(function (result) { return result.stdout; })
        .then(ramda_1.trim)
        .then(ramda_1.tap(log_1.log))
        .then(getVersion)
        .then(function (version) {
        return {
            name: name,
            version: version,
            path: binary
        };
    })
        .catch(returnError);
}
function detectBrowserLinux(browser) {
    return getLinuxBrowser(browser.name, browser.binary, browser.versionRegex);
}
exports.detectBrowserLinux = detectBrowserLinux;
