"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function validEditor(editor) {
    if (editor === undefined) {
        return false;
    }
    if (editor.document && !editor.document.isUntitled) {
        return true;
    }
    else {
        return false;
    }
}
exports.validEditor = validEditor;
//# sourceMappingURL=valid-editor.js.map