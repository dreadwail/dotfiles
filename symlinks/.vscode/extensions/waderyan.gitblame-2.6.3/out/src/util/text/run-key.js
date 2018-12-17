"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function runKey(tokens, key, value) {
    if (!tokens.hasOwnProperty(key)) {
        return key;
    }
    if (value.trim() === "") {
        return tokens[key](undefined);
    }
    else {
        return tokens[key](value);
    }
}
exports.runKey = runKey;
//# sourceMappingURL=run-key.js.map