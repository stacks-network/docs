"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("./util");
var linux_1 = require("../linux");
var log_1 = require("../log");
var ramda_1 = require("ramda");
var detectCanary = ramda_1.partial(util_1.findApp, [
    'Contents/MacOS/Google Chrome Canary',
    'com.google.Chrome.canary',
    'KSVersion'
]);
var detectChrome = ramda_1.partial(util_1.findApp, [
    'Contents/MacOS/Google Chrome',
    'com.google.Chrome',
    'KSVersion'
]);
var detectChromium = ramda_1.partial(util_1.findApp, [
    'Contents/MacOS/Chromium',
    'org.chromium.Chromium',
    'CFBundleShortVersionString'
]);
var browsers = {
    chrome: detectChrome,
    canary: detectCanary,
    chromium: detectChromium
};
function detectBrowserDarwin(browser) {
    var fn = browsers[browser.name];
    if (!fn) {
        // ok, maybe it is custom alias?
        log_1.log('detecting custom browser %s on darwin', browser.name);
        return linux_1.detectBrowserLinux(browser);
    }
    return fn()
        .then(ramda_1.merge({ name: browser.name }))
        .catch(function () {
        log_1.log('could not detect %s using traditional Mac methods', browser.name);
        log_1.log('trying linux search');
        return linux_1.detectBrowserLinux(browser);
    });
}
exports.detectBrowserDarwin = detectBrowserDarwin;
