"use strict";
const item_1 = require("./item");
const fs = require("fs");
const path = require("path");
const vscode_1 = require("vscode");
class FileController {
    showMoveFileDialog(options) {
        const { prompt, showFullPath = false, uri = null } = options;
        const executor = (resolve, reject) => {
            const sourcePath = uri ? uri.fsPath : this.sourcePath;
            if (!sourcePath) {
                return reject();
            }
            vscode_1.window.showInputBox({
                prompt,
                value: showFullPath ? sourcePath : path.basename(sourcePath)
            }).then(targetPath => {
                if (targetPath) {
                    targetPath = path.resolve(path.dirname(sourcePath), targetPath);
                    resolve(new item_1.FileItem(sourcePath, targetPath));
                }
            });
        };
        return new Promise(executor);
    }
    showNewFileDialog(options) {
        const { prompt, relativeToRoot = false } = options;
        const executor = (resolve, reject) => {
            let sourcePath = vscode_1.workspace.rootPath;
            if (!relativeToRoot && this.sourcePath) {
                sourcePath = path.dirname(this.sourcePath);
            }
            if (!sourcePath) {
                return reject();
            }
            vscode_1.window.showInputBox({
                prompt
            }).then(targetPath => {
                if (targetPath) {
                    targetPath = path.resolve(sourcePath, targetPath);
                    resolve(new item_1.FileItem(sourcePath, targetPath));
                }
            });
        };
        return new Promise(executor);
    }
    showRemoveFileDialog() {
        const executor = (resolve, reject) => {
            const sourcePath = this.sourcePath;
            if (!sourcePath) {
                return reject();
            }
            const onResponse = remove => {
                if (remove) {
                    return resolve(new item_1.FileItem(sourcePath));
                }
                reject();
            };
            vscode_1.window.showInformationMessage(`Delete file ${path.basename(sourcePath)}?`, 'Yes')
                .then(onResponse);
        };
        return new Promise(executor);
    }
    move(fileItem) {
        return this.moveOrDuplicate(fileItem, fileItem.move);
    }
    duplicate(fileItem) {
        return this.moveOrDuplicate(fileItem, fileItem.duplicate);
    }
    remove(fileItem) {
        const executor = (resolve, reject) => {
            fileItem.remove()
                .then(() => resolve(fileItem.sourcePath))
                .catch(() => reject(`Error deleting file "${fileItem.sourcePath}".`));
        };
        return new Promise(executor);
    }
    create(options) {
        const { fileItem, isDir = false } = options;
        const executor = (resolve, reject) => {
            const create = () => {
                fileItem.create(isDir)
                    .then(targetPath => resolve(targetPath))
                    .catch(() => reject(`Error creating ${isDir ? 'folder' : 'file'} "${fileItem.targetPath}".`));
            };
            this.ensureWritableFile(fileItem)
                .then(create, reject);
        };
        return new Promise(executor);
    }
    openFileInEditor(fileName) {
        const isDir = fs.statSync(fileName).isDirectory();
        if (isDir) {
            return;
        }
        const executor = (resolve, reject) => {
            vscode_1.workspace.openTextDocument(fileName).then(textDocument => {
                if (!textDocument) {
                    return reject('Could not open file!');
                }
                vscode_1.window.showTextDocument(textDocument).then(editor => {
                    if (!editor) {
                        return reject('Could not show document!');
                    }
                    resolve(editor);
                });
            }, reject);
        };
        return new Promise(executor);
    }
    closeCurrentFileEditor() {
        return vscode_1.commands.executeCommand('workbench.action.closeActiveEditor');
    }
    get sourcePath() {
        const activeEditor = vscode_1.window.activeTextEditor;
        const document = activeEditor && activeEditor.document;
        return document && document.fileName;
    }
    moveOrDuplicate(fileItem, fn) {
        const executor = (resolve, reject) => {
            const callFunction = () => fn.call(fileItem).then(resolve);
            this.ensureWritableFile(fileItem)
                .then(callFunction, reject);
        };
        return new Promise(executor);
    }
    ensureWritableFile(fileItem) {
        const executor = (resolve, reject) => {
            if (!fileItem.exists) {
                return resolve(true);
            }
            const onResponse = overwrite => {
                if (overwrite) {
                    return resolve(true);
                }
                reject();
            };
            vscode_1.window.showInformationMessage(`File ${fileItem.targetPath} already exists.`, 'Overwrite')
                .then(onResponse);
        };
        return new Promise(executor);
    }
}
exports.FileController = FileController;
//# sourceMappingURL=controller.js.map