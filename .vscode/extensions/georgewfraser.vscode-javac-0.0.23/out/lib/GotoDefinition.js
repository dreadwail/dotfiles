"use strict";
var VSCode = require('vscode');
var Finder = require('./Finder');
/**
 * Provides go-to-definition by calling javac service
 */
var GotoDefinition = (function () {
    function GotoDefinition(javac) {
        this.javac = javac;
    }
    GotoDefinition.prototype.provideDefinition = function (document, position, token) {
        var text = document.getText();
        var path = document.uri.fsPath;
        var config = Finder.findJavaConfig(VSCode.workspace.rootPath, document.fileName);
        var javac = this.javac.getJavac(config.sourcePath, config.classPath, config.outputDirectory);
        var response = javac.then(function (javac) { return javac.goto({ path: path, text: text, position: position }); });
        return response.then(asDefinition);
    };
    return GotoDefinition;
}());
exports.GotoDefinition = GotoDefinition;
function asDefinition(response) {
    return response.definitions.map(asLocation);
}
function asLocation(d) {
    var start = asPosition(d.range.start);
    var end = asPosition(d.range.end);
    var range = new VSCode.Range(start, end);
    return new VSCode.Location(VSCode.Uri.parse(d.uri), range);
}
function asPosition(r) {
    return new VSCode.Position(r.line, r.character);
}
//# sourceMappingURL=GotoDefinition.js.map