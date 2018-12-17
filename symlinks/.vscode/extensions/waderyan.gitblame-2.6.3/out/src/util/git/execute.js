"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const execcommand_1 = require("../execcommand");
const command_1 = require("./command");
async function executeGit(logger, gitArguments, fileName, gitCommand = command_1.getGitCommand, executor = execcommand_1.execute) {
    const result = await executor(logger, gitCommand(), gitArguments, {
        cwd: path_1.dirname(fileName),
    });
    return result.trim();
}
exports.executeGit = executeGit;
//# sourceMappingURL=execute.js.map