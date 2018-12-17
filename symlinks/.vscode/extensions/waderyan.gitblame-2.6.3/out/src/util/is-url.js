"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const url_1 = require("url");
function isUrl(url) {
    try {
        const uri = new url_1.URL(url);
        return uri.protocol.startsWith("http");
    }
    catch (err) {
        return false;
    }
}
exports.isUrl = isUrl;
//# sourceMappingURL=is-url.js.map