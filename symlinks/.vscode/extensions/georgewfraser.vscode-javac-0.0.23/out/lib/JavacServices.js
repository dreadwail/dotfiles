"use strict";
var ChildProcess = require('child_process');
var Path = require('path');
var PortFinder = require('portfinder');
var Net = require('net');
var Finder_1 = require('./Finder');
var split = require('split');
PortFinder.basePort = 55220;
/**
 * Holds a single instance of JavacServices with a particular source path, class path, and output directory.
 * If classpath, source path, or output directory change, starts a new JavacServices.
 */
var JavacServicesHolder = (function () {
    function JavacServicesHolder(projectDirectoryPath, extensionDirectoryPath, onError) {
        this.projectDirectoryPath = projectDirectoryPath;
        this.extensionDirectoryPath = extensionDirectoryPath;
        this.onError = onError;
    }
    /**
     * Get an instance of JavacServices with given source path, class path, output directory.
     * If these arguments are the same as the last time this function was called,
     * returns the same, cached JavacServices.
     */
    JavacServicesHolder.prototype.getJavac = function (sourcePath, classPath, outputDirectory) {
        sourcePath = sourcePath.sort();
        classPath = classPath.sort();
        if (!sortedArrayEquals(sourcePath, this.cachedSourcePath) ||
            !sortedArrayEquals(classPath, this.cachedClassPath) ||
            outputDirectory != this.cachedOutputDirectory) {
            // TODO kill old compiler
            this.cachedSourcePath = sourcePath;
            this.cachedClassPath = classPath;
            this.cachedOutputDirectory = outputDirectory;
            this.cachedCompiler = this.newJavac(sourcePath, classPath, outputDirectory);
        }
        return this.cachedCompiler;
    };
    JavacServicesHolder.prototype.newJavac = function (sourcePath, classPath, outputDirectory) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var javaPath = Finder_1.findJavaExecutable('java');
            PortFinder.getPort(function (err, port) {
                var javacServicesClassPath = [Path.resolve(_this.extensionDirectoryPath, "out", "fat-jar.jar")];
                var javac = new JavacServices(javaPath, javacServicesClassPath, port, _this.projectDirectoryPath, _this.extensionDirectoryPath, sourcePath, classPath, outputDirectory, _this.onError);
                resolve(javac);
            });
        });
    };
    return JavacServicesHolder;
}());
exports.JavacServicesHolder = JavacServicesHolder;
function sortedArrayEquals(xs, ys) {
    if (xs == null && ys == null)
        return true;
    else if (xs == null || ys == null)
        return false;
    else if (xs.length != ys.length)
        return false;
    else {
        for (var i = 0; i < xs.length; i++) {
            if (xs[i] != ys[i])
                return false;
        }
        return true;
    }
}
/**
 * Starts an external java process running org.javacs.Main
 * Invokes functions on this process using a local network socket.
 */
var JavacServices = (function () {
    function JavacServices(javaExecutablePath, javacServicesClassPath, port, projectDirectoryPath, extensionDirectoryPath, sourcePath, classPath, outputDirectory, onError) {
        var _this = this;
        this.onError = onError;
        /** # requests we've made so far, used to generate unique request ids */
        this.requestCounter = 0;
        /** What to do after each response comes back */
        this.requestCallbacks = {};
        var args = ['-cp', javacServicesClassPath.join(':')];
        //args.push('-agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=5005');
        args.push('-Djavacs.port=' + port);
        args.push('-Djavacs.sourcePath=' + sourcePath.join(':'));
        args.push('-Djavacs.classPath=' + classPath.join(':'));
        args.push('-Djavacs.outputDirectory=' + outputDirectory);
        args.push('org.javacs.Main');
        console.log(javaExecutablePath + ' ' + args.join(' '));
        // Connect to socket that will be used for communication
        this.socket = new Promise(function (resolve, reject) {
            Net.createServer(function (socket) {
                console.log('Child process connected on port ' + port);
                // Handle responses from the child java process
                socket
                    .pipe(split())
                    .on('data', function (response) {
                    if (response.length > 0)
                        _this.handleResponse(response);
                });
                resolve(socket);
            }).listen(port, function () {
                var options = { stdio: 'inherit', cwd: projectDirectoryPath };
                // Start the child java process
                ChildProcess.spawn(javaExecutablePath, args, options);
            });
        });
    }
    JavacServices.prototype.echo = function (message) {
        return this.doRequest('echo', message);
    };
    JavacServices.prototype.lint = function (request) {
        return this.doRequest('lint', request);
    };
    JavacServices.prototype.autocomplete = function (request) {
        return this.doRequest('autocomplete', request);
    };
    JavacServices.prototype.goto = function (request) {
        return this.doRequest('goto', request);
    };
    JavacServices.prototype.doRequest = function (type, payload) {
        var _this = this;
        var requestId = this.requestCounter++;
        return new Promise(function (resolve, reject) {
            var request = { requestId: requestId };
            // Set payload, using request type as key for easy deserialization
            request[type] = payload;
            // Send request to child process
            _this.socket.then(function (socket) { return socket.write(JSON.stringify(request)); });
            // Set callback handler
            _this.requestCallbacks[requestId] = function (response) {
                if (response.error != null)
                    reject(response.error.message);
                else
                    resolve(response[type]);
            };
        });
    };
    JavacServices.prototype.handleResponse = function (message) {
        var response = JSON.parse(message);
        if (response.error)
            this.onError(response.error.message);
        if (response.requestId != null) {
            var todo = this.requestCallbacks[response.requestId];
            this.requestCallbacks[response.requestId] = null;
            if (!todo)
                console.error('No callback registered for request id ' + response.requestId);
            else
                todo(response);
        }
    };
    return JavacServices;
}());
exports.JavacServices = JavacServices;
//# sourceMappingURL=JavacServices.js.map