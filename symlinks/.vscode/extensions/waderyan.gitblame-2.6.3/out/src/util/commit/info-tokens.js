"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const date_fns_1 = require("date-fns");
function commitInfoTokens(commit) {
    const authorTime = date_fns_1.fromUnixTime(parseInt(commit["author-time"], 10));
    const committerTime = date_fns_1.fromUnixTime(parseInt(commit["committer-time"], 10));
    return {
        "author.mail": () => commit["author-mail"],
        "author.name": () => commit.author,
        "author.timestamp": () => commit["author-time"],
        "author.tz": () => commit["author-tz"],
        "commit.filename": () => commit.filename,
        "commit.hash": () => commit.hash,
        "commit.hash_short": (length = "7") => {
            const cutoffPoint = length.toString();
            return commit.hash.substr(0, parseInt(cutoffPoint, 10));
        },
        "commit.summary": () => commit.summary,
        "committer.mail": () => commit["committer-mail"],
        "committer.name": () => commit.committer,
        "committer.timestamp": () => commit["committer-time"],
        "committer.tz": () => commit["committer-tz"],
        "time.ago": () => date_fns_1.formatDistance(authorTime, new Date()),
        "time.c_ago": () => date_fns_1.formatDistance(committerTime, new Date()),
        "time.c_custom": (dateFormat = "Y-MM-dd'T'hh:mm:ss.SSS") => date_fns_1.format(committerTime, dateFormat, {
            awareOfUnicodeTokens: true,
        }),
        "time.c_from": () => date_fns_1.formatDistance(committerTime, new Date()),
        "time.custom": (dateFormat = "Y-MM-dd'T'hh:mm:ss.SSS") => date_fns_1.format(authorTime, dateFormat, {
            awareOfUnicodeTokens: true,
        }),
        "time.from": () => date_fns_1.formatDistance(authorTime, new Date()),
    };
}
exports.commitInfoTokens = commitInfoTokens;
//# sourceMappingURL=info-tokens.js.map