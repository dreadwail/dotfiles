"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var vscode=require("vscode");function useLSP(){return vscode.workspace.getConfiguration("flow").get("useLSP")}function activate(e){useLSP()?require("./flowLSP").activate(e):require("./flowNonLSP").activate(e)}exports.activate=activate;
//# sourceMappingURL=index.js.map
