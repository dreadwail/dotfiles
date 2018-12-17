"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isNormalizedInfo(info) {
    const infoKeys = Object.keys(info);
    return infoKeys.every((key) => {
        if (typeof info[key] !== "function") {
            return false;
        }
        if (typeof info[key]("10") !== "string") {
            return false;
        }
        else {
            return true;
        }
    });
}
exports.isNormalizedInfo = isNormalizedInfo;
//# sourceMappingURL=is-normalized-info.js.map