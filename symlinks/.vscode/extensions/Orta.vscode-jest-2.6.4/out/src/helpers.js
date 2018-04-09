"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const os_1 = require("os");
const fs_1 = require("fs");
const path_1 = require("path");
/**
 *  Handles getting the jest runner, handling the OS and project specific work too
 *
 * @returns {string}
 */
function pathToJest(pluginSettings) {
    const path = path_1.normalize(pluginSettings.pathToJest);
    const defaultPath = path_1.normalize('node_modules/.bin/jest');
    if (path === defaultPath && isBootstrappedWithCreateReactApp(pluginSettings.rootPath)) {
        // If it's the default, run the script instead
        return 'npm test --';
    }
    return path;
}
exports.pathToJest = pathToJest;
function isBootstrappedWithCreateReactApp(rootPath) {
    // Known binary names of `react-scripts` forks:
    const packageBinaryNames = ['react-scripts', 'react-native-scripts', 'react-scripts-ts', 'react-app-rewired'];
    // If possible, try to parse `package.json` and look for known binary beeing called in `scripts.test`
    try {
        const packagePath = path_1.join(rootPath, 'package.json');
        const packageJSON = JSON.parse(fs_1.readFileSync(packagePath, 'utf8'));
        if (!packageJSON || !packageJSON.scripts || !packageJSON.scripts.test) {
            return false;
        }
        const testCommand = packageJSON.scripts.test;
        return packageBinaryNames.some(binary => testCommand.indexOf(binary + ' test ') === 0);
    }
    catch (_a) { }
    // In case parsing `package.json` failed or was unconclusive,
    // fallback to checking for the presence of the binaries in `./node_modules/.bin`
    return packageBinaryNames.some(binary => hasNodeExecutable(rootPath, binary));
}
function hasNodeExecutable(rootPath, executable) {
    const ext = os_1.platform() === 'win32' ? '.cmd' : '';
    const absolutePath = path_1.join(rootPath, 'node_modules', '.bin', executable + ext);
    return fs_1.existsSync(absolutePath);
}
/**
 * Handles getting the path to config file
 *
 * @returns {string}
 */
function pathToConfig(pluginSettings) {
    if (pluginSettings.pathToConfig !== '') {
        return path_1.normalize(pluginSettings.pathToConfig);
    }
    return '';
}
exports.pathToConfig = pathToConfig;
function pathToJestPackageJSON(pluginSettings) {
    let pathToNodeModules = path_1.join(pluginSettings.rootPath, 'node_modules');
    if (pluginSettings.pathToJest) {
        const relativeJestCmd = removeSurroundingQuotes(pluginSettings.pathToJest.split(' ')[0]);
        const relativePathToNodeModules = relativeJestCmd.replace(/node_modules.+$/i, 'node_modules');
        pathToNodeModules = path_1.join(pluginSettings.rootPath, relativePathToNodeModules);
    }
    const defaultPath = path_1.normalize(path_1.join(pathToNodeModules, 'jest/package.json'));
    const cliPath = path_1.normalize(path_1.join(pathToNodeModules, 'jest-cli/package.json'));
    const craPath = path_1.normalize(path_1.join(pathToNodeModules, 'react-scripts/node_modules/jest/package.json'));
    const paths = [defaultPath, cliPath, craPath];
    for (const i in paths) {
        if (fs_1.existsSync(paths[i])) {
            return paths[i];
        }
    }
    return null;
}
exports.pathToJestPackageJSON = pathToJestPackageJSON;
function removeSurroundingQuotes(str) {
    return str.replace(/^['"`]/, '').replace(/['"`]$/, '');
}
/**
 *  Taken From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions
 */
function escapeRegExp(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}
exports.escapeRegExp = escapeRegExp;
//# sourceMappingURL=helpers.js.map