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
const controller_1 = require("../controller");
exports.controller = new controller_1.NewFileController();
function newFile(options) {
    return __awaiter(this, void 0, void 0, function* () {
        const { relativeToRoot = false } = options || {};
        const dialogOptions = { prompt: 'File Name', relativeToRoot };
        const fileItem = yield exports.controller.showDialog(dialogOptions);
        const newFileItem = yield exports.controller.execute({ fileItem });
        return exports.controller.openFileInEditor(newFileItem);
    });
}
exports.newFile = newFile;
function newFileAtRoot() {
    return newFile({ relativeToRoot: true });
}
exports.newFileAtRoot = newFileAtRoot;
function newFolder(options) {
    return __awaiter(this, void 0, void 0, function* () {
        const { relativeToRoot = false } = options || {};
        const dialogOptions = { prompt: 'Folder Name', relativeToRoot };
        const fileItem = yield exports.controller.showDialog(dialogOptions);
        const executeOptions = { fileItem, isDir: true };
        return exports.controller.execute(executeOptions);
    });
}
exports.newFolder = newFolder;
function newFolderAtRoot() {
    return newFolder({ relativeToRoot: true });
}
exports.newFolderAtRoot = newFolderAtRoot;
//# sourceMappingURL=NewFileCommand.js.map