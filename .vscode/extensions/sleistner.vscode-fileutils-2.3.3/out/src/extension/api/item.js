"use strict";
const fs = require("fs-extra-promise");
const path = require("path");
class FileItem {
    constructor(sourcePath, targetPath = null) {
        this.SourcePath = sourcePath;
        this.TargetPath = targetPath;
    }
    get sourcePath() {
        return this.SourcePath;
    }
    get targetPath() {
        return this.TargetPath;
    }
    get exists() {
        return fs.existsSync(this.targetPath);
    }
    move() {
        return this.moveOrDuplicate(fs.renameAsync);
    }
    duplicate() {
        return this.moveOrDuplicate(fs.copyAsync);
    }
    remove() {
        const executor = (resolve, reject) => {
            fs.removeAsync(this.sourcePath)
                .then(() => resolve(this.sourcePath))
                .catch(err => reject(err.message));
        };
        return new Promise(executor);
    }
    create(isDir = false) {
        const fn = isDir ? fs.ensureDirAsync : fs.createFileAsync;
        const executor = (resolve, reject) => {
            fs.removeAsync(this.targetPath)
                .then(() => fn(this.targetPath))
                .then(() => resolve(this.targetPath))
                .catch(err => reject(err.message));
        };
        return new Promise(executor);
    }
    moveOrDuplicate(fn) {
        const executor = (resolve, reject) => {
            fs.ensureDirAsync(path.dirname(this.targetPath))
                .then(() => fn(this.sourcePath, this.targetPath))
                .then(() => resolve(this.targetPath))
                .catch(err => reject(err.message));
        };
        return new Promise(executor);
    }
}
exports.FileItem = FileItem;
//# sourceMappingURL=item.js.map