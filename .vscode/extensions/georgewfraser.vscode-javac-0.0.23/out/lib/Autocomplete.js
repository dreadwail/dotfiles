"use strict";
var VSCode = require('vscode');
var Finder_1 = require('./Finder');
/**
 * Provides autocomplete feature by calling javac service
 */
var Autocomplete = (function () {
    function Autocomplete(javac) {
        this.javac = javac;
    }
    Autocomplete.prototype.provideCompletionItems = function (document, position, token) {
        var text = document.getText();
        var path = document.uri.fsPath;
        var config = Finder_1.findJavaConfig(VSCode.workspace.rootPath, document.fileName);
        var javac = this.javac.getJavac(config.sourcePath, config.classPath, config.outputDirectory);
        var response = javac.then(function (javac) { return javac.autocomplete({ path: path, text: text, position: position }); });
        return response.then(asCompletionItems);
    };
    return Autocomplete;
}());
exports.Autocomplete = Autocomplete;
/**
 * Convert JSON (returned by javac service process) to CompletionItem
 */
function asCompletionItems(response) {
    return response.suggestions.map(asCompletionItem);
}
function asCompletionItem(s) {
    var item = new VSCode.CompletionItem(s.label);
    item.detail = s.detail;
    item.documentation = s.documentation;
    item.filterText = s.filterText;
    item.insertText = s.insertText;
    item.kind = s.kind;
    item.label = s.label;
    item.sortText = s.sortText;
    return item;
}
//# sourceMappingURL=Autocomplete.js.map