"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getLinenumber(editor) {
    if (editor) {
        return editor.selection.active.line;
    }
}
exports.getLinenumber = getLinenumber;
//# sourceMappingURL=get-linenumber.js.map