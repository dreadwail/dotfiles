"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function pluralText(count, singular, plural) {
    if (count === 1) {
        return `${count} ${singular}`;
    }
    return `${count} ${plural}`;
}
exports.pluralText = pluralText;
//# sourceMappingURL=plural-text.js.map