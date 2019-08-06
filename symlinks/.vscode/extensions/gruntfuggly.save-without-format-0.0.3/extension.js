var vscode = require( 'vscode' );

function activate( context )
{
    var disposable = vscode.commands.registerCommand( 'save-without-format.save', function()
    {
        var config = vscode.workspace.getConfiguration();
        var fos = config.get( 'editor.formatOnSave' );
        config.update( 'editor.formatOnSave', false ).then( function()
        {
            vscode.commands.executeCommand( 'workbench.action.files.save' ).then( function()
            {
                config.update( 'editor.formatOnSave', fos ).then( function() { } );
            } );
        } );
    } );

    context.subscriptions.push( disposable );
}
exports.activate = activate;

function deactivate()
{
}
exports.deactivate = deactivate;
