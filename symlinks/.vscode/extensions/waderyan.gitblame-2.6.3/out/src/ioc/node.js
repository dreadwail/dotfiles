"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
function nodeInjections(container) {
    container.bind("ExecuteFile")
        .toConstantValue(child_process_1.execFile);
}
exports.nodeInjections = nodeInjections;
//# sourceMappingURL=node.js.map