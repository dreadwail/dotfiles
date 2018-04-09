"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs-extra");
const path = require("path");
// tslint:disable-next-line
const trash = require('trash');
class FileItem {
    constructor(sourcePath, targetPath) {
        this.SourcePath = sourcePath;
        this.TargetPath = targetPath;
    }
    get path() {
        return this.SourcePath;
    }
    get targetPath() {
        return this.TargetPath;
    }
    get exists() {
        return fs.existsSync(this.targetPath);
    }
    move() {
        return this.ensureDir()
            .then(() => fs.rename(this.path, this.targetPath))
            .then(() => {
            this.SourcePath = this.targetPath;
            return this;
        });
    }
    duplicate() {
        return this.ensureDir()
            .then(() => fs.copy(this.path, this.targetPath))
            .then(() => new FileItem(this.targetPath));
    }
    remove(useTrash = false) {
        const action = useTrash ? trash([this.path]) : fs.remove(this.path);
        return Promise.resolve(action)
            .then(() => this);
    }
    create(isDir = false) {
        const fn = isDir ? fs.ensureDir : fs.createFile;
        return Promise.resolve(fs.remove(this.targetPath))
            .then(() => fn(this.targetPath))
            .then(() => new FileItem(this.targetPath));
    }
    ensureDir() {
        return Promise.resolve(fs.ensureDir(path.dirname(this.targetPath)));
    }
}
exports.FileItem = FileItem;
//# sourceMappingURL=item.js.map