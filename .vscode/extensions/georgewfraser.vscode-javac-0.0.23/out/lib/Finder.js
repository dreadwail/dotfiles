'use strict';
var FS = require('fs');
var Path = require('path');
var binPathCache = {};
var runtimePathCache = null;
function findJavaExecutable(binname) {
    binname = correctBinname(binname);
    if (binPathCache[binname])
        return binPathCache[binname];
    // First search each JAVA_HOME bin folder
    if (process.env['JAVA_HOME']) {
        var workspaces = process.env['JAVA_HOME'].split(Path.delimiter);
        for (var i = 0; i < workspaces.length; i++) {
            var binpath = Path.join(workspaces[i], 'bin', binname);
            if (FS.existsSync(binpath)) {
                binPathCache[binname] = binpath;
                return binpath;
            }
        }
    }
    // Then search PATH parts
    if (process.env['PATH']) {
        var pathparts = process.env['PATH'].split(Path.delimiter);
        for (var i = 0; i < pathparts.length; i++) {
            var binpath = Path.join(pathparts[i], binname);
            if (FS.existsSync(binpath)) {
                binPathCache[binname] = binpath;
                return binpath;
            }
        }
    }
    // Else return the binary name directly (this will likely always fail downstream) 
    binPathCache[binname] = binname;
    return binname;
}
exports.findJavaExecutable = findJavaExecutable;
function correctBinname(binname) {
    if (process.platform === 'win32')
        return binname + '.exe';
    else
        return binname;
}
var javaConfigCache = {};
var locationCache = {};
var DEFAULT_JAVA_CONFIG = {
    sourcePath: ["src"],
    outputDirectory: "target",
    classPath: []
};
/**
 * Get the latest saved version of javaconfig.json
 * in the nearest parent directory of [fileName]
 */
function findJavaConfig(workspaceRoot, javaSource) {
    workspaceRoot = Path.normalize(workspaceRoot);
    javaSource = Path.resolve(workspaceRoot, javaSource);
    var location = findLocation(workspaceRoot, javaSource);
    return loadConfig(location);
}
exports.findJavaConfig = findJavaConfig;
/**
 * Forget all the cached javaconfig.json locations and contents
 */
function invalidateCaches() {
    javaConfigCache = {};
    locationCache = {};
}
exports.invalidateCaches = invalidateCaches;
function loadConfig(javaConfig) {
    if (javaConfig == null)
        return DEFAULT_JAVA_CONFIG;
    if (!javaConfigCache.hasOwnProperty(javaConfig)) {
        var rootPath_1 = Path.dirname(javaConfig);
        var text = FS.readFileSync(javaConfig, 'utf8');
        var json = JSON.parse(text);
        var classPathPath = Path.resolve(rootPath_1, json.classPathFile);
        var classPathText = FS.readFileSync(classPathPath, 'utf8');
        var classPath = classPathText.split(':');
        var sourcePath = json.sourcePath.map(function (s) { return Path.resolve(rootPath_1, s); });
        var outputDirectory = Path.resolve(rootPath_1, json.outputDirectory);
        javaConfigCache[javaConfig] = { sourcePath: sourcePath, classPath: classPath, outputDirectory: outputDirectory };
    }
    return javaConfigCache[javaConfig];
}
function findLocation(workspaceRoot, javaSource) {
    if (!locationCache.hasOwnProperty(javaSource))
        locationCache[javaSource] = doFindLocation(workspaceRoot, javaSource);
    return locationCache[javaSource];
}
function doFindLocation(workspaceRoot, javaSource) {
    var pointer = Path.dirname(javaSource);
    while (true) {
        var candidate = Path.resolve(pointer, 'javaconfig.json');
        if (FS.existsSync(candidate))
            return candidate;
        else if (pointer === workspaceRoot || pointer === Path.dirname(pointer))
            return null;
        else
            pointer = Path.dirname(pointer);
    }
}
//# sourceMappingURL=Finder.js.map