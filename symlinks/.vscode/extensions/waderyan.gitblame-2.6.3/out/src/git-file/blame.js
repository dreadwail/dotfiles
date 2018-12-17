"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_1 = require("inversify");
const file_1 = require("@/git/file");
const file_2 = require("@/util/file");
const git_1 = require("@/util/git");
const filephysical_1 = require("@/git/filephysical");
let GitBlameFile = class GitBlameFile {
    constructor(logger, gitUtil, fileUtil) {
        this.logger = logger;
        this.gitUtil = gitUtil;
        this.fileUtil = fileUtil;
    }
    async blame(file) {
    }
    async getFile(file) {
        if (this.isFilesystemFile(file)) {
            return this.getFilesystemFile(file);
        }
        return new file_1.GitFile(file.uri.fsPath);
    }
    async getFilesystemFile(file) {
        return new filephysical_1.GitFilePhysical();
    }
    async isFilesystemFile(file) {
        if (file.isUntitled) {
            return false;
        }
        if (!this.fileUtil.inWorkspace(file.uri)) {
            return false;
        }
        const workTree = await this.gitUtil.getWorkTree(this.logger, file.uri.fsPath);
        return !!workTree;
    }
};
GitBlameFile = __decorate([
    inversify_1.injectable(),
    __metadata("design:paramtypes", [Object, git_1.GitUtil,
        file_2.FileUtil])
], GitBlameFile);
exports.GitBlameFile = GitBlameFile;
//# sourceMappingURL=blame.js.map