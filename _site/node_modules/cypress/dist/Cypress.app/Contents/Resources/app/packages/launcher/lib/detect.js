"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var linux_1 = require("./linux");
var darwin_1 = require("./darwin");
var windows_1 = require("./windows");
var log_1 = require("./log");
var browsers_1 = require("./browsers");
var Bluebird = require("bluebird");
var ramda_1 = require("ramda");
var _ = require("lodash");
var os = require("os");
var setMajorVersion = function (obj) {
    if (obj.version) {
        obj.majorVersion = obj.version.split('.')[0];
        log_1.log('browser %s version %s major version %s', obj.name, obj.version, obj.majorVersion);
    }
    return obj;
};
var detectors = {
    darwin: darwin_1.detectBrowserDarwin,
    linux: linux_1.detectBrowserLinux,
    win32: windows_1.detectBrowserWindows
};
function lookup(platform, obj) {
    log_1.log('looking up %s on %s platform', obj.name, platform);
    var detector = detectors[platform];
    if (!detector) {
        throw new Error("Cannot lookup browser " + obj.name + " on " + platform);
    }
    return detector(obj);
}
function checkOneBrowser(browser) {
    var platform = os.platform();
    var pickBrowserProps = ramda_1.pick([
        'name',
        'displayName',
        'type',
        'version',
        'path'
    ]);
    var logBrowser = function (props) {
        log_1.log('setting major version for %j', props);
    };
    var failed = function (err) {
        if (err.notInstalled) {
            log_1.log('browser %s not installed', browser.name);
            return false;
        }
        throw err;
    };
    log_1.log('checking one browser %s', browser.name);
    return lookup(platform, browser)
        .then(ramda_1.merge(browser))
        .then(pickBrowserProps)
        .then(ramda_1.tap(logBrowser))
        .then(setMajorVersion)
        .catch(failed);
}
/** returns list of detected browsers */
function detectBrowsers() {
    // we can detect same browser under different aliases
    // tell them apart by the full version property
    var removeDuplicates = ramda_1.uniqBy(ramda_1.prop('version'));
    return Bluebird.mapSeries(browsers_1.browsers, checkOneBrowser)
        .then(_.compact)
        .then(removeDuplicates);
}
exports.default = detectBrowsers;
