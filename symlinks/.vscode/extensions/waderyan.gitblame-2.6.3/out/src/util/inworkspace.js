"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
function inWorkspace(fileName) {
    if (typeof fileName === "string") {
        return vscode_1.workspace.getWorkspaceFolder(vscode_1.Uri.parse(fileName)) !== undefined;
    }
    return vscode_1.workspace.getWorkspaceFolder(fileName) !== undefined;
}
exports.inWorkspace = inWorkspace;
//# sourceMappingURL=inworkspace.js.map