'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const Path = require("path");
const FS = require("fs");
const vscode_1 = require("vscode");
const vscode_languageclient_1 = require("vscode-languageclient");
// If we want to profile using VisualVM, we have to run the language server using regular java, not jlink
// This is intended to be used in the 'F5' debug-extension mode, where the extension is running against the actual source, not build.vsix
const visualVm = false;
/** Called when extension is activated */
function activate(context) {
    console.log('Activating Java');
    // Options to control the language client
    let clientOptions = {
        // Register the server for java documents
        documentSelector: ['java'],
        synchronize: {
            // Synchronize the setting section 'java' to the server
            // NOTE: this currently doesn't do anything
            configurationSection: 'java',
            // Notify the server about file changes to 'javaconfig.json' files contain in the workspace
            fileEvents: [
                vscode_1.workspace.createFileSystemWatcher('**/javaconfig.json'),
                vscode_1.workspace.createFileSystemWatcher('**/pom.xml'),
                vscode_1.workspace.createFileSystemWatcher('**/WORKSPACE'),
                vscode_1.workspace.createFileSystemWatcher('**/BUILD'),
                vscode_1.workspace.createFileSystemWatcher('**/*.java')
            ]
        },
        outputChannelName: 'Java',
        revealOutputChannelOn: 4 // never
    };
    let launcherRelativePath = platformSpecificLauncher();
    let launcherPath = [context.extensionPath].concat(launcherRelativePath);
    let launcher = Path.resolve(...launcherPath);
    console.log(launcher);
    // Start the child java process
    let serverOptions = {
        command: launcher,
        args: [],
        options: { cwd: context.extensionPath }
    };
    if (visualVm) {
        serverOptions = visualVmConfig(context);
    }
    // Copied from typescript
    vscode_1.languages.setLanguageConfiguration('java', {
        indentationRules: {
            // ^(.*\*/)?\s*\}.*$
            decreaseIndentPattern: /^((?!.*?\/\*).*\*\/)?\s*[\}\]\)].*$/,
            // ^.*\{[^}"']*$
            increaseIndentPattern: /^((?!\/\/).)*(\{[^}"'`]*|\([^)"'`]*|\[[^\]"'`]*)$/,
            indentNextLinePattern: /^\s*(for|while|if|else)\b(?!.*[;{}]\s*(\/\/.*|\/[*].*[*]\/\s*)?$)/
        },
        onEnterRules: [
            {
                // e.g. /** | */
                beforeText: /^\s*\/\*\*(?!\/)([^\*]|\*(?!\/))*$/,
                afterText: /^\s*\*\/$/,
                action: { indentAction: vscode_1.IndentAction.IndentOutdent, appendText: ' * ' }
            }, {
                // e.g. /** ...|
                beforeText: /^\s*\/\*\*(?!\/)([^\*]|\*(?!\/))*$/,
                action: { indentAction: vscode_1.IndentAction.None, appendText: ' * ' }
            }, {
                // e.g.  * ...|
                beforeText: /^(\t|(\ \ ))*\ \*(\ ([^\*]|\*(?!\/))*)?$/,
                action: { indentAction: vscode_1.IndentAction.None, appendText: '* ' }
            }, {
                // e.g.  */|
                beforeText: /^(\t|(\ \ ))*\ \*\/\s*$/,
                action: { indentAction: vscode_1.IndentAction.None, removeText: 1 }
            },
            {
                // e.g.  *-----*/|
                beforeText: /^(\t|(\ \ ))*\ \*[^/]*\*\/\s*$/,
                action: { indentAction: vscode_1.IndentAction.None, removeText: 1 }
            }
        ]
    });
    // Create the language client and start the client.
    let client = new vscode_languageclient_1.LanguageClient('java', 'Java Language Server', serverOptions, clientOptions);
    let disposable = client.start();
    // Push the disposable to the context's subscriptions so that the 
    // client can be deactivated on extension deactivation
    context.subscriptions.push(disposable);
    // Register test commands
    vscode_1.commands.registerCommand('java.command.test.run', runTest);
    vscode_1.commands.registerCommand('java.command.findReferences', runFindReferences);
    // When the language client activates, register a progress-listener
    client.onReady().then(() => createProgressListeners(client));
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;
function runFindReferences(uri, lineNumber, column) {
    // LSP is 0-based but VSCode is 1-based
    return vscode_1.commands.executeCommand('editor.action.findReferences', vscode_1.Uri.parse(uri), { lineNumber: lineNumber + 1, column: column + 1 });
}
function runTest(sourceUri, className, methodName) {
    let file = vscode_1.Uri.parse(sourceUri).fsPath;
    file = Path.relative(vscode_1.workspace.rootPath, file);
    let kind = {
        type: 'java.task.test',
        className: className,
        methodName: methodName,
    };
    var shell;
    let config = vscode_1.workspace.getConfiguration('java');
    // Run method or class
    if (methodName != null) {
        let command = config.get('testMethod');
        if (command.length == 0) {
            vscode_1.window.showErrorMessage('Set "java.testMethod" in .vscode/settings.json');
            shell = new vscode_1.ShellExecution('echo', ['Set "java.testMethod" in .vscode/settings.json, for example ["mvn", "test", "-Dtest=${class}#${method}"]']);
        }
        else {
            shell = templateCommand(command, file, className, methodName);
        }
    }
    else {
        let command = config.get('testClass');
        if (command.length == 0) {
            vscode_1.window.showErrorMessage('Set "java.testClass" in .vscode/settings.json');
            shell = new vscode_1.ShellExecution('echo', ['Set "java.testClass" in .vscode/settings.json, for example ["mvn", "test", "-Dtest=${class}"]']);
        }
        else {
            shell = templateCommand(command, file, className, methodName);
        }
    }
    let workspaceFolder = vscode_1.workspace.getWorkspaceFolder(vscode_1.Uri.parse(sourceUri));
    let task = new vscode_1.Task(kind, workspaceFolder, 'Java Test', 'Java Language Server', shell);
    return vscode_1.tasks.executeTask(task);
}
function templateCommand(command, file, className, methodName) {
    // Replace template parameters
    var replaced = [];
    for (var i = 0; i < command.length; i++) {
        let c = command[i];
        c = c.replace('${file}', file);
        c = c.replace('${class}', className);
        c = c.replace('${method}', methodName);
        replaced[i] = c;
    }
    // Populate env
    let env = Object.assign({}, process.env);
    return new vscode_1.ShellExecution(replaced[0], replaced.slice(1), { env });
}
function createProgressListeners(client) {
    // Create a "checking files" progress indicator
    let progressListener = new class {
        startProgress(message) {
            if (this.progress != null)
                this.endProgress();
            vscode_1.window.withProgress({ title: message, location: vscode_1.ProgressLocation.Notification }, progress => new Promise((resolve, _reject) => {
                this.progress = progress;
                this.resolve = resolve;
            }));
        }
        reportProgress(message, increment) {
            if (increment == -1)
                this.progress.report({ message });
            else
                this.progress.report({ message, increment });
        }
        endProgress() {
            if (this.progress != null) {
                this.resolve({});
                this.progress = null;
                this.resolve = null;
            }
        }
    };
    // Use custom notifications to drive progressListener
    client.onNotification(new vscode_languageclient_1.NotificationType('java/startProgress'), (event) => {
        progressListener.startProgress(event.message);
    });
    client.onNotification(new vscode_languageclient_1.NotificationType('java/reportProgress'), (event) => {
        progressListener.reportProgress(event.message, event.increment);
    });
    client.onNotification(new vscode_languageclient_1.NotificationType('java/endProgress'), () => {
        progressListener.endProgress();
    });
}
function platformSpecificLauncher() {
    switch (process.platform) {
        case 'win32':
            return ['dist', 'windows', 'bin', 'launcher'];
        case 'darwin':
            return ['dist', 'mac', 'bin', 'launcher'];
    }
    throw `unsupported platform: ${process.platform}`;
}
// Alternative server options if you want to use visualvm
function visualVmConfig(context) {
    let javaExecutablePath = findJavaExecutable('java');
    if (javaExecutablePath == null) {
        vscode_1.window.showErrorMessage("Couldn't locate java in $JAVA_HOME or $PATH");
        throw "Gave up";
    }
    let classes = Path.resolve(context.extensionPath, "target", "classes");
    let cpTxt = Path.resolve(context.extensionPath, "target", "cp.txt");
    let cpContents = FS.readFileSync(cpTxt, "utf-8");
    let args = [
        '-cp', classes + ":" + cpContents,
        '-Xverify:none',
        '-Xdebug',
        // '-agentlib:jdwp=transport=dt_socket,server=y,suspend=y,address=*:5005',
        'org.javacs.Main'
    ];
    console.log(javaExecutablePath + ' ' + args.join(' '));
    // Start the child java process
    return {
        command: javaExecutablePath,
        args: args,
        options: { cwd: context.extensionPath }
    };
}
function findJavaExecutable(binname) {
    binname = correctBinname(binname);
    // First search java.home setting
    let userJavaHome = vscode_1.workspace.getConfiguration('java').get('home');
    if (userJavaHome != null) {
        console.log('Looking for java in settings java.home ' + userJavaHome + '...');
        let candidate = findJavaExecutableInJavaHome(userJavaHome, binname);
        if (candidate != null)
            return candidate;
    }
    // Then search each JAVA_HOME
    let envJavaHome = process.env['JAVA_HOME'];
    if (envJavaHome) {
        console.log('Looking for java in environment variable JAVA_HOME ' + envJavaHome + '...');
        let candidate = findJavaExecutableInJavaHome(envJavaHome, binname);
        if (candidate != null)
            return candidate;
    }
    // Then search PATH parts
    if (process.env['PATH']) {
        console.log('Looking for java in PATH');
        let pathparts = process.env['PATH'].split(Path.delimiter);
        for (let i = 0; i < pathparts.length; i++) {
            let binpath = Path.join(pathparts[i], binname);
            if (FS.existsSync(binpath)) {
                return binpath;
            }
        }
    }
    // Else return the binary name directly (this will likely always fail downstream) 
    return null;
}
function correctBinname(binname) {
    if (process.platform === 'win32')
        return binname + '.exe';
    else
        return binname;
}
function findJavaExecutableInJavaHome(javaHome, binname) {
    let workspaces = javaHome.split(Path.delimiter);
    for (let i = 0; i < workspaces.length; i++) {
        let binpath = Path.join(workspaces[i], 'bin', binname);
        if (FS.existsSync(binpath))
            return binpath;
    }
    return null;
}
//# sourceMappingURL=extension.js.map