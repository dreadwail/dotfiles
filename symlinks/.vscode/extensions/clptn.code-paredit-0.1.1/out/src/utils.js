'use strict';
const vscode_1 = require('vscode');
function toCommand([command, start, arg]) {
    if (command === 'insert')
        return { kind: command, start: start, text: arg };
    else
        return { kind: command, start: start, length: arg };
}
exports.commands = (res) => res.changes.map(toCommand);
function end(command) {
    if (command.kind === 'insert')
        return command.start + command.text.length;
    else
        return command.start;
}
exports.end = end;
function getSelection(editor) {
    return { start: editor.document.offsetAt(editor.selection.start),
        end: editor.document.offsetAt(editor.selection.end),
        cursor: editor.document.offsetAt(editor.selection.active) };
}
exports.getSelection = getSelection;
function select(editor, pos) {
    let start, end;
    if (typeof pos === "number")
        start = end = pos;
    else if (pos instanceof Array)
        start = pos[0], end = pos[1];
    let pos1 = editor.document.positionAt(start), pos2 = editor.document.positionAt(end), sel = new vscode_1.Selection(pos1, pos2);
    editor.selection = sel;
    editor.revealRange(sel);
}
exports.select = select;
exports.handle = (editor, command) => edit => {
    let start = editor.document.positionAt(command.start);
    if (command.kind === 'insert')
        edit.insert(start, command.text);
    else {
        let end = start.translate(0, command.length);
        edit.delete(new vscode_1.Selection(start, end));
    }
};
exports.edit = (editor, commands) => commands
    .reduce((prev, command) => prev.then((_) => editor.edit(exports.handle(editor, command), { undoStopAfter: false, undoStopBefore: false })), Promise.resolve(true));
function undoStop(editor) {
    let pos = editor.document.positionAt(0);
    editor.edit((edit) => edit.insert(pos, ""), { undoStopAfter: true, undoStopBefore: false });
}
exports.undoStop = undoStop;
//# sourceMappingURL=utils.js.map