'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const Path = require("path");
const vscode_1 = require("vscode");
const vscode_languageclient_1 = require("vscode-languageclient");
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
function runTest(sourceUri, enclosingClass, method) {
    let kind = {
        type: 'java.task.test',
        enclosingClass: enclosingClass,
        method: method,
    };
    var shell;
    let config = vscode_1.workspace.getConfiguration('java');
    // Run method or class
    if (method != null) {
        let command = config.get('testMethod');
        if (command.length == 0) {
            vscode_1.window.showErrorMessage('Set "java.testMethod" in .vscode/settings.json');
            shell = new vscode_1.ShellExecution('echo', ['Set "java.testMethod" in .vscode/settings.json, for example ["mvn", "test", "-Dtest=${class}#${method}"]']);
        }
        else {
            shell = templateCommand(command, enclosingClass, method);
        }
    }
    else {
        let command = config.get('testClass');
        if (command.length == 0) {
            vscode_1.window.showErrorMessage('Set "java.testClass" in .vscode/settings.json');
            shell = new vscode_1.ShellExecution('echo', ['Set "java.testClass" in .vscode/settings.json, for example ["mvn", "test", "-Dtest=${class}"]']);
        }
        else {
            shell = templateCommand(command, enclosingClass, method);
        }
    }
    let workspaceFolder = vscode_1.workspace.getWorkspaceFolder(vscode_1.Uri.parse(sourceUri));
    let task = new vscode_1.Task(kind, workspaceFolder, 'Java Test', 'Java Language Server', shell);
    return vscode_1.tasks.executeTask(task);
}
function templateCommand(command, enclosingClass, method) {
    // Replace template parameters
    var replaced = [];
    for (var i = 0; i < command.length; i++) {
        replaced[i] = command[i].replace('${class}', enclosingClass).replace('${method}', method);
    }
    // Populate env
    let env = {};
    let config = vscode_1.workspace.getConfiguration('java');
    if (config.has('home'))
        env['JAVA_HOME'] = config.get('home');
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
//# sourceMappingURL=extension.js.map