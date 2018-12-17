"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("@/constants");
function isBlankCommit(commit) {
    return commit.hash === constants_1.HASH_NO_COMMIT_GIT;
}
exports.isBlankCommit = isBlankCommit;
//# sourceMappingURL=is-blank.js.map