"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var log_1 = require("../log");
var execa = require("execa");
var path_1 = require("path");
var ramda_1 = require("ramda");
var fs_extra_1 = require("fs-extra");
var os_1 = require("os");
var notInstalledErr = function (name) {
    var err = new Error("Browser not installed: " + name);
    err.notInstalled = true;
    return err;
};
function formFullAppPath(name) {
    var prefix = 'C:/Program Files (x86)/Google/Chrome/Application';
    return path_1.normalize(path_1.join(prefix, name + ".exe"));
}
function formChromiumAppPath() {
    var exe = 'C:/Program Files (x86)/Google/chrome-win32/chrome.exe';
    return path_1.normalize(exe);
}
function formChromeCanaryAppPath() {
    var home = os_1.homedir();
    var exe = path_1.join(home, 'AppData', 'Local', 'Google', 'Chrome SxS', 'Application', 'chrome.exe');
    return path_1.normalize(exe);
}
var formPaths = {
    chrome: formFullAppPath,
    canary: formChromeCanaryAppPath,
    chromium: formChromiumAppPath
};
function getWindowsBrowser(name, binary) {
    var getVersion = function (stdout) {
        // result from wmic datafile
        // "Version=61.0.3163.100"
        var wmicVersion = /^Version=(\S+)$/;
        var m = wmicVersion.exec(stdout);
        if (m) {
            return m[1];
        }
        log_1.log('Could not extract version from %s using regex %s', stdout, wmicVersion);
        throw notInstalledErr(binary);
    };
    var formFullAppPathFn = formPaths[name] || formFullAppPath;
    var exePath = formFullAppPathFn(name);
    log_1.log('exe path %s', exePath);
    var doubleEscape = function (s) { return s.replace(/\\/g, '\\\\'); };
    return fs_extra_1.pathExists(exePath)
        .then(function (exists) {
        log_1.log('found %s ?', exePath, exists);
        if (!exists) {
            throw notInstalledErr("Browser " + name + " file not found at " + exePath);
        }
        // on Windows using "--version" seems to always start the full
        // browser, no matter what one does.
        var args = [
            'datafile',
            'where',
            "name=\"" + doubleEscape(exePath) + "\"",
            'get',
            'Version',
            '/value'
        ];
        return execa('wmic', args)
            .then(function (result) { return result.stdout; })
            .then(ramda_1.trim)
            .then(ramda_1.tap(log_1.log))
            .then(getVersion)
            .then(function (version) {
            log_1.log("browser %s at '%s' version %s", name, exePath, version);
            return {
                name: name,
                version: version,
                path: exePath
            };
        });
    })
        .catch(function () {
        throw notInstalledErr(name);
    });
}
function detectBrowserWindows(browser) {
    return getWindowsBrowser(browser.name, browser.binary);
}
exports.detectBrowserWindows = detectBrowserWindows;
