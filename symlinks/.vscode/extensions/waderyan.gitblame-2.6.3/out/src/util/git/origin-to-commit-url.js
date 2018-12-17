"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const url_1 = require("url");
function originToCommitUrl(gitOrigin, commitHash, isPlural) {
    const httplessUrl = gitOrigin.replace(/^[a-z]+:\/\//i, "");
    const colonlessUrl = httplessUrl.replace(/:([a-z]+)\/?/i, "/$1/");
    const gitlessUrl = colonlessUrl.replace(".git", "");
    let uri;
    try {
        uri = new url_1.URL(`https://${gitlessUrl}`);
    }
    catch (err) {
        return "";
    }
    const host = uri.hostname;
    const path = uri.pathname;
    const commit = isPlural ? "commits" : "commit";
    if (path === "/") {
        return `https://${host}/${commit}/${commitHash}`;
    }
    else {
        return `https://${host}${path}/${commit}/${commitHash}`;
    }
}
exports.originToCommitUrl = originToCommitUrl;
//# sourceMappingURL=origin-to-commit-url.js.map