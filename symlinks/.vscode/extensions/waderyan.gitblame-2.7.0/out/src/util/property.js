"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
class Property {
    static get(name) {
        const properties = vscode_1.workspace.getConfiguration("gitblame");
        return properties.get(name);
    }
}
exports.Property = Property;
//# sourceMappingURL=property.js.map