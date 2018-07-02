"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const vscode_1 = require("vscode");
class AbstractFileController {
    openFileInEditor(fileItem) {
        return __awaiter(this, void 0, void 0, function* () {
            const isDir = fs.statSync(fileItem.path).isDirectory();
            if (isDir) {
                return;
            }
            const textDocument = yield vscode_1.workspace.openTextDocument(fileItem.path);
            if (!textDocument) {
                throw new Error('Could not open file!');
            }
            const editor = yield vscode_1.window.showTextDocument(textDocument, vscode_1.ViewColumn.Active);
            if (!editor) {
                throw new Error('Could not show document!');
            }
            return editor;
        });
    }
    closeCurrentFileEditor() {
        return __awaiter(this, void 0, void 0, function* () {
            return vscode_1.commands.executeCommand('workbench.action.closeActiveEditor');
        });
    }
    ensureWritableFile(fileItem) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!fileItem.exists) {
                return fileItem;
            }
            const message = `File '${fileItem.targetPath}' already exists.`;
            const action = 'Overwrite';
            const overwrite = yield vscode_1.window.showInformationMessage(message, { modal: true }, action);
            if (overwrite) {
                return fileItem;
            }
            throw new Error();
        });
    }
    get sourcePath() {
        const activeEditor = vscode_1.window.activeTextEditor;
        const document = activeEditor && activeEditor.document;
        return document && document.fileName;
    }
}
exports.AbstractFileController = AbstractFileController;
//# sourceMappingURL=AbstractFileController.js.map