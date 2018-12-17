"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const info_tokens_1 = require("@/util/commit/info-tokens");
const is_blank_1 = require("@/util/commit/is-blank");
const property_1 = require("@/util/property");
const parse_tokens_1 = require("@/util/text/parse-tokens");
function toTextView(commit, format, prop = property_1.getProperty) {
    if (is_blank_1.isBlankCommit(commit)) {
        return prop("statusBarMessageNoCommit")
            || "Not Committed Yet";
    }
    const normalizedCommitInfo = info_tokens_1.commitInfoTokens(commit);
    if (format) {
        return parse_tokens_1.parseTokens(format, normalizedCommitInfo);
    }
    const messageFormat = prop("statusBarMessageFormat");
    if (messageFormat) {
        return parse_tokens_1.parseTokens(messageFormat, normalizedCommitInfo);
    }
    else {
        return "No configured message format for gitblame";
    }
}
exports.toTextView = toTextView;
//# sourceMappingURL=to-text-view.js.map