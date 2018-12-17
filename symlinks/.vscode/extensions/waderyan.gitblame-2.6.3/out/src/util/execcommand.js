"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const errorhandler_1 = require("./errorhandler");
function execute(command, args, options = {}) {
    return new Promise((resolve, reject) => {
        errorhandler_1.ErrorHandler.logCommand(`${command} ${args.join(" ")}`);
        child_process_1.execFile(command, args, options, execFileCallback(command, resolve, reject));
    });
}
exports.execute = execute;
function execFileCallback(command, resolve, reject) {
    return (error, stdout, stderr) => {
        if (!error) {
            resolve(stdout);
            return;
        }
        if (error.code === "ENOENT") {
            const message = `${command}: No such file or directory. (ENOENT)`;
            errorhandler_1.ErrorHandler.logCritical(error, message);
            resolve("");
            return;
        }
        errorhandler_1.ErrorHandler.logError(new Error(stderr));
        resolve("");
        return;
    };
}
//# sourceMappingURL=execcommand.js.map