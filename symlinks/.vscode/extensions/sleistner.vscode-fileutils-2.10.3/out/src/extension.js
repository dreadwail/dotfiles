"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const commands = require("./command");
const Cache_1 = require("./lib/Cache");
function handleError(err) {
    if (err) {
        vscode.window.showErrorMessage(err);
    }
    return err;
}
function register(context, handler) {
    const commandName = `fileutils.${handler.name}`;
    const fn = (...args) => handler(...args).catch(handleError);
    const disposable = vscode.commands.registerCommand(commandName, fn);
    context.subscriptions.push(disposable);
}
function activate(context) {
    Cache_1.Cache.context = context;
    register(context, commands.moveFile);
    register(context, commands.renameFile);
    register(context, commands.duplicateFile);
    register(context, commands.removeFile);
    register(context, commands.newFile);
    register(context, commands.newFileAtRoot);
    register(context, commands.newFolder);
    register(context, commands.newFolderAtRoot);
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map