"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const constants_1 = require("../constants");
function getGitCommand() {
    const vscodeGit = vscode_1.extensions.getExtension("vscode.git");
    if (vscodeGit
        && vscodeGit.exports
        && vscodeGit.exports.git
        && vscodeGit.exports.git.path) {
        return vscodeGit.exports.git.path;
    }
    else {
        return constants_1.GIT_COMMAND_IN_PATH;
    }
}
exports.getGitCommand = getGitCommand;
//# sourceMappingURL=gitcommand.js.map