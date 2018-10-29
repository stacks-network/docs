"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs_extra_1 = require("fs-extra");
var browsers_1 = require("./browsers");
var detect_1 = require("./detect");
var Promise = require('bluebird');
var missingConfig = function () {
    return Promise.reject(new Error('You must provide a path to a config file.'));
};
var wrap = function (all) { return ({
    launch: function (name, url, args) {
        if (args === void 0) { args = []; }
        return browsers_1.launch(all, name, url, args);
    }
}); };
var init = function (browsers) {
    return browsers ? wrap(browsers) : detect_1.default().then(wrap);
};
var api = init;
var update = function (pathToConfig) {
    if (!pathToConfig) {
        return missingConfig();
    }
    // detect the browsers and set the config
    var saveBrowsers = function (browers) {
        return fs_extra_1.writeJson(pathToConfig, browers, { spaces: 2 });
    };
    return detect_1.default().then(saveBrowsers);
};
// extend "api" with a few utility methods for convenience
api.update = update;
api.detect = detect_1.default;
module.exports = api;
