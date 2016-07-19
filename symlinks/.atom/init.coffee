# Your init script
#
# Atom will evaluate this file each time a new window is opened. It is run
# after packages are loaded/activated and after the previous editor state
# has been restored.
#
# An example hack to log to the console when each text editor is saved.
#
# atom.workspace.observeTextEditors (editor) ->
#   editor.onDidSave ->
#     console.log "Saved! #{editor.getPath()}"
atom.commands.add 'atom-workspace', 'vim-mode-plus:toggle-enabled', ->
  disabledPackages = atom.config.get('core.disabledPackages')
  disabledPackageIndex = disabledPackages.indexOf('vim-mode-plus')
  if disabledPackageIndex is -1
    disabledPackages.push('vim-mode-plus')
  else
    disabledPackages.splice(disabledPackageIndex, 1)
  atom.config.set('core.disabledPackages', disabledPackages)


consumeService = (packageName, providerName, fn) ->
  disposable = atom.packages.onDidActivatePackage (pack) ->
    return unless pack.name is packageName
    service = pack.mainModule[providerName]()
    fn(service)
    disposable.dispose()

consumeService 'vim-mode-plus', 'provideVimModePlus', (service) ->
  {observeVimStates} = service

  observeVimStates (vimState) ->
    vimState.modeManager.onDidDeactivateMode ({mode}) ->
      if mode is 'insert'
        vimState.editor.clearSelections()
