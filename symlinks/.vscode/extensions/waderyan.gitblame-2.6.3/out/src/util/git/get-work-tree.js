"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const execute_1 = require("./execute");
async function getWorkTree(logger, fileName, executor = execute_1.executeGit) {
    const workTree = await executor(logger, ["rev-parse", "--show-toplevel"], fileName);
    if (workTree === "") {
        return "";
    }
    else {
        return path_1.normalize(workTree);
    }
}
exports.getWorkTree = getWorkTree;
//# sourceMappingURL=get-work-tree.js.map