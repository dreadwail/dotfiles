"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("@/constants");
function blankCommitInfo(real = false) {
    return {
        "author": "",
        "author-mail": "",
        "author-time": "",
        "author-tz": "",
        "committer": "",
        "committer-mail": "",
        "committer-time": "",
        "committer-tz": "",
        "filename": "",
        "generated": !real,
        "hash": constants_1.HASH_NO_COMMIT_GIT,
        "summary": "",
    };
}
exports.blankCommitInfo = blankCommitInfo;
//# sourceMappingURL=blank-commit.js.map