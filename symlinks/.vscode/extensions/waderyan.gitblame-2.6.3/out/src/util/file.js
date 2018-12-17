"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
class FileUtil {
    inWorkspace(fileName) {
        if (typeof fileName === "string") {
            const uriFileName = vscode_1.Uri.parse(fileName);
            return vscode_1.workspace.getWorkspaceFolder(uriFileName) !== undefined;
        }
        return vscode_1.workspace.getWorkspaceFolder(fileName) !== undefined;
    }
}
exports.FileUtil = FileUtil;
//# sourceMappingURL=file.js.map