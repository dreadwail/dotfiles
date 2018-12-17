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
const path_1 = require("path");
const url_1 = require("url");
let GitUtil = class GitUtil {
    constructor(extensionsGetter, executor) {
        this.extensionsGetter = extensionsGetter;
        this.executor = executor;
    }
    async getOrigin(logger, fileName) {
        if (typeof fileName === "undefined") {
            return "";
        }
        const originUrl = await this.execute(logger, ["ls-remote", "--get-url", "origin"], fileName);
        return originUrl.trim();
    }
    async getWorkTree(logger, fileName) {
        const workTree = await this.execute(logger, ["rev-parse", "--show-toplevel"], fileName);
        if (workTree === "") {
            return "";
        }
        else {
            return path_1.normalize(workTree);
        }
    }
    originToCommitUrl(gitOrigin, commitHash, isPlural) {
        const httplessUrl = gitOrigin.replace(/^[a-z]+:\/\//i, "");
        const colonlessUrl = httplessUrl.replace(/:([a-z]+)\/?/i, "/$1/");
        const gitlessUrl = colonlessUrl.replace(".git", "");
        let uri;
        try {
            uri = new url_1.URL(`https://${gitlessUrl}`);
        }
        catch (err) {
            return "";
        }
        const host = uri.hostname;
        const path = uri.pathname;
        const commit = isPlural ? "commits" : "commit";
        if (path === "/") {
            return `https://${host}/${commit}/${commitHash}`;
        }
        else {
            return `https://${host}${path}/${commit}/${commitHash}`;
        }
    }
    getCommand() {
        const vscodeGit = this.extensionsGetter("vscode.git");
        if (vscodeGit
            && vscodeGit.exports
            && vscodeGit.exports.git
            && vscodeGit.exports.git.path) {
            return vscodeGit.exports.git.path;
        }
        else {
            return "git";
        }
    }
    async execute(logger, gitArguments, fileName) {
        const result = await this.executor(logger, this.getCommand(), gitArguments, {
            cwd: path_1.dirname(fileName),
        });
        return result.trim();
    }
};
GitUtil = __decorate([
    inversify_1.injectable(),
    __metadata("design:paramtypes", [Function, Function])
], GitUtil);
exports.GitUtil = GitUtil;
//# sourceMappingURL=git.js.map