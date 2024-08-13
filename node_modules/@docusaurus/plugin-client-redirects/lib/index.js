"use strict";
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateOptions = void 0;
const tslib_1 = require("tslib");
const utils_1 = require("@docusaurus/utils");
const collectRedirects_1 = tslib_1.__importDefault(require("./collectRedirects"));
const writeRedirectFiles_1 = tslib_1.__importStar(require("./writeRedirectFiles"));
function pluginClientRedirectsPages(context, options) {
    const { trailingSlash } = context.siteConfig;
    return {
        name: 'docusaurus-plugin-client-redirects',
        async postBuild(props) {
            const pluginContext = {
                relativeRoutesPaths: props.routesPaths.map((path) => `${(0, utils_1.addLeadingSlash)((0, utils_1.removePrefix)(path, props.baseUrl))}`),
                baseUrl: props.baseUrl,
                outDir: props.outDir,
                options,
                siteConfig: props.siteConfig,
            };
            const redirects = (0, collectRedirects_1.default)(pluginContext, trailingSlash);
            const redirectFiles = (0, writeRedirectFiles_1.toRedirectFiles)(redirects, pluginContext, trailingSlash);
            // Write files only at the end: make code more easy to test without IO
            await (0, writeRedirectFiles_1.default)(redirectFiles);
        },
    };
}
exports.default = pluginClientRedirectsPages;
var options_1 = require("./options");
Object.defineProperty(exports, "validateOptions", { enumerable: true, get: function () { return options_1.validateOptions; } });
