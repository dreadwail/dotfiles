"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const blame_1 = require("./git/blame");
function activate(context) {
    if (vscode_1.workspace.workspaceFolders) {
        const app = new blame_1.GitBlame();
        const blameCommand = vscode_1.commands.registerCommand("gitblame.quickInfo", app.showMessage, app);
        const linkCommand = vscode_1.commands.registerCommand("gitblame.online", app.blameLink, app);
        const copyHashCommand = vscode_1.commands.registerCommand("gitblame.addCommitHashToClipboard", app.copyHash, app);
        const copyToolUrl = vscode_1.commands.registerCommand("gitblame.addToolUrlToClipboard", app.copyToolUrl, app);
        context.subscriptions.push(app, blameCommand, linkCommand, copyHashCommand, copyToolUrl);
    }
}
exports.activate = activate;
//# sourceMappingURL=index.js.map