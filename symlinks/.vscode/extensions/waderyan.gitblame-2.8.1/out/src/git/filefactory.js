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
const fs_1 = require("fs");
const vscode_1 = require("vscode");
const filedummy_1 = require("./filedummy");
const filephysical_1 = require("./filephysical");
class GitFileFactory {
    static create(fileName, disposeCallback) {
        return __awaiter(this, void 0, void 0, function* () {
            if (GitFileFactory.inWorkspace(fileName)
                && (yield this.exists(fileName))) {
                return new filephysical_1.GitFilePhysical(fileName, disposeCallback);
            }
            else {
                return new filedummy_1.GitFileDummy(fileName, disposeCallback);
            }
        });
    }
    static inWorkspace(fileName) {
        const uriFileName = vscode_1.Uri.file(fileName);
        return typeof vscode_1.workspace.getWorkspaceFolder(uriFileName) !== "undefined";
    }
    static exists(fileName) {
        return new Promise((resolve) => {
            fs_1.access(fileName, (err) => {
                if (err) {
                    resolve(false);
                }
                else {
                    resolve(true);
                }
            });
        });
    }
}
exports.GitFileFactory = GitFileFactory;
//# sourceMappingURL=filefactory.js.map