"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const url_1 = require("url");
const valid_url_1 = require("valid-url");
const vscode_1 = require("vscode");
const constants_1 = require("../constants");
const actionablemessageitem_1 = require("../util/actionablemessageitem");
const editorvalidator_1 = require("../util/editorvalidator");
const errorhandler_1 = require("../util/errorhandler");
const execcommand_1 = require("../util/execcommand");
const gitcommand_1 = require("../util/gitcommand");
const property_1 = require("../util/property");
const textdecorator_1 = require("../util/textdecorator");
const throttle_function_1 = require("../util/throttle.function");
const view_1 = require("../view");
const filefactory_1 = require("./filefactory");
class GitBlame {
    constructor() {
        this.files = new Map();
        this.statusBarView = view_1.StatusBarView.getInstance();
        this.disposable = this.setupDisposables();
        this.setupListeners();
        this.init();
    }
    static blankBlameInfo() {
        return {
            commits: {},
            lines: {},
        };
    }
    static blankCommitInfo(real = false) {
        const emptyAuthor = {
            mail: "",
            name: "",
            timestamp: 0,
            tz: "",
        };
        const emptyCommitter = {
            mail: "",
            name: "",
            timestamp: 0,
            tz: "",
        };
        const commitInfo = {
            author: emptyAuthor,
            committer: emptyCommitter,
            filename: "",
            generated: true,
            hash: constants_1.HASH_NO_COMMIT_GIT,
            summary: "",
        };
        if (real) {
            delete commitInfo.generated;
        }
        return commitInfo;
    }
    static isBlankCommit(commit) {
        return commit.hash === constants_1.HASH_NO_COMMIT_GIT;
    }
    static stripGitRemoteUrl(rawUrl) {
        const httplessUrl = rawUrl.replace(/^[a-z-]+:\/\//i, "");
        const colonlessUrl = httplessUrl.replace(/:([a-z_\.~+%-][a-z0-9_\.~+%-]+)\/?/i, "/$1/");
        return colonlessUrl.replace(/\.git$/i, "");
    }
    blameLink() {
        return __awaiter(this, void 0, void 0, function* () {
            const commitInfo = yield this.getCommitInfo();
            const commitToolUrl = yield this.getToolUrl(commitInfo);
            if (commitToolUrl) {
                vscode_1.commands.executeCommand("vscode.open", commitToolUrl);
            }
            else {
                vscode_1.window.showErrorMessage("Missing gitblame.commitUrl configuration value.");
            }
        });
    }
    showMessage() {
        return __awaiter(this, void 0, void 0, function* () {
            const commitInfo = yield this.getCommitInfo();
            if (commitInfo.hash === constants_1.HASH_NO_COMMIT_GIT) {
                this.clearView();
                return;
            }
            const messageFormat = property_1.Property.get("infoMessageFormat") || "";
            const normalizedTokens = textdecorator_1.TextDecorator.normalizeCommitInfoTokens(commitInfo);
            const message = textdecorator_1.TextDecorator.parseTokens(messageFormat, normalizedTokens);
            const extraActions = this.generateMessageActions(commitInfo);
            this.updateView(commitInfo);
            const actionedItem = yield vscode_1.window.showInformationMessage(message, ...(yield extraActions));
            if (actionedItem) {
                actionedItem.takeAction();
            }
        });
    }
    defaultWebPath(url, hash, isPlural) {
        const gitlessUrl = GitBlame.stripGitRemoteUrl(url);
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
        return `https://${host}${path}/${commit}/${hash}`;
    }
    projectNameFromOrigin(origin) {
        const match = /([a-zA-Z0-9_~%+\.-]*?(\.git)?)$/.exec(origin);
        if (!match) {
            return "";
        }
        return match[1].replace(".git", "");
    }
    dispose() {
        vscode_1.Disposable.from(...this.files.values()).dispose();
        this.disposable.dispose();
    }
    setupDisposables() {
        // The blamer does not use the ErrorHandler but
        // is responsible for keeping it disposable
        const errorHandler = errorhandler_1.ErrorHandler.getInstance();
        return vscode_1.Disposable.from(this.statusBarView, errorHandler);
    }
    setupListeners() {
        const disposables = [];
        vscode_1.window.onDidChangeActiveTextEditor(this.onTextEditorMove, this, disposables);
        vscode_1.window.onDidChangeTextEditorSelection(this.onTextEditorMove, this, disposables);
        vscode_1.workspace.onDidSaveTextDocument(this.onTextEditorMove, this, disposables);
        this.disposable = vscode_1.Disposable.from(this.disposable, ...disposables);
    }
    init() {
        this.onTextEditorMove();
    }
    onTextEditorMove() {
        return __awaiter(this, void 0, void 0, function* () {
            const beforeBlameOpenFile = this.getCurrentActiveFileName();
            const beforeBlameLineNumber = this.getCurrentActiveLineNumber();
            const commitInfo = yield this.getCurrentLineInfo();
            // Only update if we haven't moved since we started blaming
            if (beforeBlameOpenFile === this.getCurrentActiveFileName() &&
                beforeBlameLineNumber === this.getCurrentActiveLineNumber()) {
                this.updateView(commitInfo);
            }
        });
    }
    getCurrentActiveFileName() {
        if (vscode_1.window
            && vscode_1.window.activeTextEditor
            && vscode_1.window.activeTextEditor.document) {
            return vscode_1.window.activeTextEditor.document.fileName;
        }
        else {
            return "no-file";
        }
    }
    getCurrentActiveLineNumber() {
        if (vscode_1.window
            && vscode_1.window.activeTextEditor
            && vscode_1.window.activeTextEditor.selection
            && vscode_1.window.activeTextEditor.selection.active) {
            return vscode_1.window.activeTextEditor.selection.active.line;
        }
        else {
            return -1;
        }
    }
    generateMessageActions(commitInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            const commitToolUrl = yield this.getToolUrl(commitInfo);
            const extraActions = [];
            if (commitToolUrl) {
                const viewOnlineAction = new actionablemessageitem_1.ActionableMessageItem(constants_1.TITLE_VIEW_ONLINE);
                viewOnlineAction.setAction(() => {
                    vscode_1.commands.executeCommand("vscode.open", commitToolUrl);
                });
                extraActions.push(viewOnlineAction);
            }
            return extraActions;
        });
    }
    getCommitInfo() {
        return __awaiter(this, void 0, void 0, function* () {
            const commitInfo = yield this.getCurrentLineInfo();
            if (commitInfo.generated) {
                vscode_1.window.showErrorMessage("The current file and line can not be blamed.");
            }
            return commitInfo;
        });
    }
    getToolUrl(commitInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            if (GitBlame.isBlankCommit(commitInfo)) {
                return;
            }
            const remote = this.getRemoteUrl();
            const commitUrl = property_1.Property.get("commitUrl") || "";
            const origin = yield this.getOriginOfActiveFile();
            const projectName = this.projectNameFromOrigin(origin);
            const remoteUrl = GitBlame.stripGitRemoteUrl(yield remote);
            const parsedUrl = commitUrl
                .replace(/\$\{hash\}/g, commitInfo.hash)
                .replace(/\$\{project.remote\}/g, remoteUrl)
                .replace(/\$\{project.name\}/g, projectName);
            if (valid_url_1.isWebUri(parsedUrl)) {
                return vscode_1.Uri.parse(parsedUrl);
            }
            else if (parsedUrl === "guess") {
                const isWebPathPlural = !!property_1.Property.get("isWebPathPlural");
                if (origin) {
                    const uri = this.defaultWebPath(origin, commitInfo.hash, isWebPathPlural);
                    return vscode_1.Uri.parse(uri);
                }
                else {
                    return;
                }
            }
            else if (parsedUrl !== "no") {
                vscode_1.window.showErrorMessage(`Malformed URL in gitblame.commitUrl. ` +
                    `Must be a valid web url, "guess", or "no". ` +
                    `Currently expands to: '${parsedUrl}'`);
            }
        });
    }
    updateView(commitInfo) {
        if (commitInfo.generated) {
            this.clearView();
        }
        else {
            this.statusBarView.update(commitInfo);
        }
    }
    clearView() {
        this.statusBarView.clear();
    }
    getBlameInfo(fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.files.has(fileName)) {
                this.files.set(fileName, filefactory_1.GitFileFactory.create(fileName, this.generateDisposeFunction(fileName)));
            }
            const blameFile = this.files.get(fileName);
            if (blameFile) {
                return blameFile.blame();
            }
            else {
                return {
                    commits: {},
                    lines: {},
                };
            }
        });
    }
    getCurrentLineInfo() {
        return __awaiter(this, void 0, void 0, function* () {
            if (editorvalidator_1.isActiveEditorValid()
                && vscode_1.window
                && vscode_1.window.activeTextEditor) {
                return this.getLineInfo(vscode_1.window.activeTextEditor.document.fileName, vscode_1.window.activeTextEditor.selection.active.line);
            }
            else {
                return GitBlame.blankCommitInfo();
            }
        });
    }
    getLineInfo(fileName, lineNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            const commitLineNumber = lineNumber + 1;
            const blameInfo = yield this.getBlameInfo(fileName);
            if (blameInfo.lines[commitLineNumber]) {
                const hash = blameInfo.lines[commitLineNumber];
                return blameInfo.commits[hash];
            }
            else {
                return GitBlame.blankCommitInfo();
            }
        });
    }
    getRemoteUrl() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!editorvalidator_1.isActiveEditorValid()
                || !(vscode_1.window
                    && vscode_1.window.activeTextEditor)) {
                return "";
            }
            const gitCommand = gitcommand_1.getGitCommand();
            const activeFile = vscode_1.window.activeTextEditor.document.fileName;
            const activeFileFolder = path_1.parse(activeFile).dir;
            const currentBranch = yield execcommand_1.execute(gitCommand, [
                "symbolic-ref",
                "-q",
                "--short",
                "HEAD",
            ], {
                cwd: activeFileFolder,
            });
            const curRemote = yield execcommand_1.execute(gitCommand, [
                "config",
                "--local",
                "--get",
                `branch.${currentBranch.trim()}.remote`,
            ], {
                cwd: activeFileFolder,
            });
            const remoteUrl = yield execcommand_1.execute(gitCommand, [
                "config",
                "--local",
                "--get",
                `remote.${curRemote.trim()}.url`,
            ], {
                cwd: activeFileFolder,
            });
            return remoteUrl.trim();
        });
    }
    getOriginOfActiveFile() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!editorvalidator_1.isActiveEditorValid()
                || !(vscode_1.window
                    && vscode_1.window.activeTextEditor)) {
                return "";
            }
            const gitCommand = gitcommand_1.getGitCommand();
            const activeFile = vscode_1.window.activeTextEditor.document.fileName;
            const activeFileFolder = path_1.parse(activeFile).dir;
            const originUrl = yield execcommand_1.execute(gitCommand, [
                "ls-remote",
                "--get-url",
                "origin",
            ], {
                cwd: activeFileFolder,
            });
            return originUrl.trim();
        });
    }
    generateDisposeFunction(fileName) {
        return () => {
            this.files.delete(fileName);
        };
    }
}
__decorate([
    throttle_function_1.throttleFunction(16)
], GitBlame.prototype, "onTextEditorMove", null);
exports.GitBlame = GitBlame;
//# sourceMappingURL=blame.js.map