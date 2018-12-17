"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const is_normalized_info_1 = require("@/util/is-normalized-info");
const run_key_1 = require("@/util/text/run-key");
function parseTokens(target, tokens) {
    return target.replace(/\$\{([a-z\.\-\_]{1,})[,]*(|.{1,}?)(?=\})}/gi, (path, key, value) => {
        if (is_normalized_info_1.isNormalizedInfo(tokens)) {
            return run_key_1.runKey(tokens, key, value);
        }
        else {
            return key;
        }
    });
}
exports.parseTokens = parseTokens;
//# sourceMappingURL=parse-tokens.js.map