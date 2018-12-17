"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const date_fns_1 = require("date-fns");
const vscode_1 = require("vscode");
const constants_1 = require("../constants");
const property_1 = require("./property");
class Logger {
    constructor(channel, prop = property_1.getProperty, showErrorMessage = vscode_1.window.showErrorMessage) {
        this.prop = prop;
        this.showErrorMessage = showErrorMessage;
        if (channel === undefined) {
            this.channel = vscode_1.window.createOutputChannel("Extension: gitblame");
        }
        else {
            this.channel = channel;
        }
    }
    dispose() {
        this.channel.dispose();
    }
    async log(level, message, error) {
        if (level === "critical" && typeof error !== "undefined") {
            this.writeToLog(level, error.toString());
            await this.displayErrorMessage(message);
        }
        else {
            this.writeToLog(level, message);
        }
    }
    async displayErrorMessage(message) {
        const selectedItem = await this.showErrorMessage(message, constants_1.TITLE_SHOW_LOG);
        if (selectedItem === constants_1.TITLE_SHOW_LOG) {
            this.channel.show();
        }
    }
    writeToLog(level, message) {
        const enabledLevels = this.prop("logLevel");
        if (enabledLevels && enabledLevels.includes(level)) {
            const timestamp = date_fns_1.format(new Date(), "hh:mm:ss");
            this.channel.appendLine(`[ ${timestamp} | ${level} ] ${message.trim()}`);
        }
    }
}
exports.Logger = Logger;
//# sourceMappingURL=logger.js.map