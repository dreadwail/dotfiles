"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const moment = require("moment");
const blame_1 = require("../git/blame");
const property_1 = require("./property");
class TextDecorator {
    static toTextView(commit) {
        if (blame_1.GitBlame.isBlankCommit(commit)) {
            return property_1.Property.get("statusBarMessageNoCommit")
                || "Not Committed Yet";
        }
        const normalizedCommitInfo = TextDecorator.normalizeCommitInfoTokens(commit);
        const messageFormat = property_1.Property.get("statusBarMessageFormat");
        if (messageFormat) {
            return TextDecorator.parseTokens(messageFormat, normalizedCommitInfo);
        }
        else {
            return "No configured message format for gitblame";
        }
    }
    static toDateText(dateNow, dateThen) {
        const momentNow = moment(dateNow);
        const momentThen = moment(dateThen);
        const months = momentNow.diff(momentThen, "months");
        const days = momentNow.diff(momentThen, "days");
        const hours = momentNow.diff(momentThen, "hours");
        const minutes = momentNow.diff(momentThen, "minutes");
        if (minutes <= 4) {
            return "right now";
        }
        else if (minutes <= 70) {
            return (minutes + " " + (minutes === 1 ? "minute" : "minutes") + " ago");
        }
        else if (hours <= 47) {
            return hours + " " + (hours === 1 ? "hour" : "hours") + " ago";
        }
        else if (days <= 40) {
            return days + " " + (days === 1 ? "day" : "days") + " ago";
        }
        else {
            return months + " " + (months === 1 ? "month" : "months") + " ago";
        }
    }
    static parseTokens(target, tokens) {
        const tokenRegex = /\$\{([a-z\.\-\_]{1,})[,]*(|.{1,}?)(?=\})}/gi;
        if (typeof target !== "string") {
            return "";
        }
        return target.replace(tokenRegex, (path, key, inValue) => {
            return TextDecorator.runKey(tokens, key, inValue);
        });
    }
    static runKey(tokens, key, value) {
        const currentToken = tokens[key];
        if (key === "commit.hash_short") {
            return tokens["commit.hash_short"](value);
        }
        if (key === "time.c_custom") {
            return tokens["time.c_custom"](value);
        }
        if (key === "time.custom") {
            return tokens["time.custom"](value);
        }
        if (currentToken) {
            return currentToken();
        }
        return key;
    }
    static normalizeCommitInfoTokens(commit) {
        const now = new Date();
        const authorTime = moment.unix(commit.author.timestamp);
        const committerTime = moment.unix(commit.committer.timestamp);
        return {
            "author.mail": () => commit.author.mail,
            "author.name": () => commit.author.name,
            "author.timestamp": () => commit.author.timestamp.toString(),
            "author.tz": () => commit.author.tz,
            "commit.filename": () => commit.filename,
            "commit.hash": () => commit.hash,
            "commit.hash_short": (length = "7") => {
                const cutoffPoint = length.toString();
                return commit.hash.substr(0, parseInt(cutoffPoint, 10));
            },
            "commit.summary": () => commit.summary,
            "committer.mail": () => commit.committer.mail,
            "committer.name": () => commit.committer.name,
            "committer.timestamp": () => commit.committer.timestamp.toString(),
            "committer.tz": () => commit.committer.tz,
            "time.ago": () => TextDecorator.toDateText(now, authorTime.toDate()),
            "time.c_ago": () => TextDecorator.toDateText(now, committerTime.toDate()),
            "time.c_custom": (format = "") => committerTime.format(format),
            "time.c_from": () => committerTime.fromNow(),
            "time.custom": (format = "") => authorTime.format(format),
            "time.from": () => authorTime.fromNow(),
        };
    }
}
exports.TextDecorator = TextDecorator;
//# sourceMappingURL=textdecorator.js.map