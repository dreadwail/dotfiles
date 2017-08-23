'use strict';
const vscode_1 = require('vscode');
const activeColour = "white";
const inactiveColour = "#b3b3b3";
const colour = { "active": "white", "inactive": "#b3b3b3" };
class StatusBar {
    constructor(enabled = true, strict = true, visible = true) {
        this._toggleBarItem = vscode_1.window.createStatusBarItem();
        this._toggleBarItem.text = "(λ)";
        this._toggleBarItem.command = 'paredit.toggle';
        this.enabled = enabled;
        this.visible = visible;
        this._strictBarItem = vscode_1.window.createStatusBarItem();
        this._strictBarItem.text = "strict";
        this._strictBarItem.command = 'paredit.toggleStrict';
        this.strict = strict;
        this.visible = visible;
    }
    get enabled() {
        return this._enabled;
    }
    set enabled(value) {
        this._enabled = value;
        if (this._enabled) {
            this._toggleBarItem.tooltip = "Disable Paredit";
            this._toggleBarItem.color = colour.active;
        }
        else {
            this._toggleBarItem.tooltip = "Enable Paredit";
            this._toggleBarItem.color = colour.inactive;
        }
    }
    get strict() {
        return this._strict;
    }
    set strict(value) {
        this._strict = value;
        if (this._strict) {
            this._strictBarItem.tooltip = "Disable Paredit Strict";
            this._strictBarItem.color = colour.active;
        }
        else {
            this._strictBarItem.tooltip = "Enable Paredit Strict";
            this._strictBarItem.color = colour.inactive;
        }
    }
    get visible() {
        return this._visible;
    }
    set visible(value) {
        if (value) {
            this._toggleBarItem.show();
        }
        else {
            this._toggleBarItem.hide();
        }
    }
    dispose() {
        this._toggleBarItem.dispose();
        this._strictBarItem.dispose();
    }
}
exports.StatusBar = StatusBar;
//# sourceMappingURL=status_bar.js.map