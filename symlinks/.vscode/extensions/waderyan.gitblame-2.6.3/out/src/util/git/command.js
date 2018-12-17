"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getGitCommand(extensionsGetter) {
    const vscodeGit = extensionsGetter("vscode.git");
    if (vscodeGit
        && vscodeGit.exports
        && vscodeGit.exports.git
        && vscodeGit.exports.git.path) {
        return vscodeGit.exports.git.path;
    }
    else {
        return "git";
    }
}
exports.getGitCommand = getGitCommand;
//# sourceMappingURL=command.js.map