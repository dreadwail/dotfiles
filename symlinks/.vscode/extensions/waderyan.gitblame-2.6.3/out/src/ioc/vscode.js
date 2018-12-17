"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
function vscodeInjections(container) {
    container.bind("ExtensionsGetter")
        .toConstantValue(vscode_1.extensions.getExtension);
}
exports.vscodeInjections = vscodeInjections;
//# sourceMappingURL=vscode.js.map