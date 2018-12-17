"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function verifyCommitKey(key) {
    const interestingPrefixes = [
        "hash",
        "author",
        "author-mail",
        "author-time",
        "author-tz",
        "committer",
        "committer-mail",
        "committer-time",
        "committer-tz",
        "summary",
        "filename",
        "generated",
    ];
    return interestingPrefixes.includes(key);
}
exports.verifyCommitKey = verifyCommitKey;
//# sourceMappingURL=verify-commit-key.js.map