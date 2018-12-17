"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BaseGitStream {
    constructor(logger, file, workTree, onCommit, onLine, onClose) {
        this.file = file;
        this.workTree = workTree;
        this.onCommit = onCommit;
        this.onLine = onLine;
        this.onClose = onClose;
        // noop
    }
    dispose() {
        // noop
    }
}
exports.BaseGitStream = BaseGitStream;
//# sourceMappingURL=basestream.js.map