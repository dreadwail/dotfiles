"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const execute_1 = require("./execute");
async function getOrigin(logger, fileName, executor = execute_1.executeGit) {
    if (typeof fileName === "undefined") {
        return "";
    }
    const originUrl = await executor(logger, ["ls-remote", "--get-url", "origin"], fileName);
    return originUrl.trim();
}
exports.getOrigin = getOrigin;
//# sourceMappingURL=get-origin.js.map