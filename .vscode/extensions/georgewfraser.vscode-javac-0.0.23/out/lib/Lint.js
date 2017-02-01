"use strict";
var VSCode = require('vscode');
var Finder_1 = require('./Finder');
/**
 * Provides lint on open, save
 */
var Lint = (function () {
    function Lint(javac, diagnosticCollection) {
        this.javac = javac;
        this.diagnosticCollection = diagnosticCollection;
    }
    /**
     * Lint document and place results in this.diagnosticCollection
     */
    Lint.prototype.doLint = function (document) {
        if (document.languageId !== 'java')
            return;
        var vsCodeJavaConfig = VSCode.workspace.getConfiguration('java');
        var textEditor = VSCode.window.activeTextEditor;
        this.runBuilds(document, vsCodeJavaConfig);
    };
    Lint.prototype.runBuilds = function (document, vsCodeJavaConfig) {
        var _this = this;
        var config = Finder_1.findJavaConfig(VSCode.workspace.rootPath, document.fileName);
        var javac = this.javac.getJavac(config.sourcePath, config.classPath, config.outputDirectory);
        javac.then(function (javac) {
            javac.lint({
                path: document.fileName
            }).then(function (lint) {
                _this.diagnosticCollection.clear();
                for (var _i = 0, _a = Object.keys(lint.messages); _i < _a.length; _i++) {
                    var uri = _a[_i];
                    var file = VSCode.Uri.file(uri);
                    var diagnostics = lint.messages[uri].map(asDiagnostic);
                    _this.diagnosticCollection.set(file, diagnostics);
                }
            }).catch(function (error) {
                VSCode.window.showErrorMessage(error);
            });
        });
    };
    return Lint;
}());
exports.Lint = Lint;
/**
 * Convert JSON (returned by javac service process) to Diagnostic
 */
function asDiagnostic(m) {
    var range = new VSCode.Range(m.range.start.line, m.range.start.character, m.range.end.line, m.range.end.character);
    return new VSCode.Diagnostic(range, m.message, m.severity);
}
//# sourceMappingURL=Lint.js.map