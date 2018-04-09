require 'rake'

SYMLINK_MANIFEST = [
  "Library/KeyBindings/DefaultKeyBinding.dict",
  "Library/Application Support/Code/User/settings.json",
  "Library/Application Support/Code/User/keybindings.json",
  ".ackrc",
  ".bash",
  ".bash_profile",
  ".bashrc",
  ".colordiffrc",
  ".git_template",
  ".gitconfig",
  ".gitignore",
  ".gvimrc",
  ".hushlogin",
  ".inputrc",
  ".profile",
  ".vimrc",
  ".zshrc",
  ".atom/config.cson",
  ".atom/init.coffee",
  ".atom/keymap.cson",
  ".atom/styles.less",
  ".atom/packages",
  ".rbenv/default-gems",
  ".rbenv/plugins",
  ".vim/after",
  ".vim/bundle/Vundle.vim",
  ".vim/colors",
  ".vscode"
]

desc "Hook our dotfiles into system-standard positions."
task :symlink do
  puts "\nSYMLINKING...\n"

  SYMLINK_MANIFEST.each do |linkable|
    target = "#{ENV["HOME"]}/#{linkable}"
    existed = false
    if File.exists?(target) || File.symlink?(target)
      existed = true

      `mv "#{target}" "#{file}.backup"`
    end
    source = "#{Dir.pwd}/symlinks/#{linkable}"
    printable_source = "symlinks/#{linkable}"
    extra = "(backed up previous existing)" if existed
    printable_target = "~/#{linkable}"
    printf "%-30s %-4s %-35s %s\n", printable_target, "->", printable_source, extra
    `mkdir -p "$(dirname "#{target}")"`
    `ln -s "#{source}" "#{target}"`
  end
end

task :brew do
  puts "\nBREWING...\n"

  `brew install ack`
  `brew install colordiff`
  `brew install ctags`
  `brew install rbenv`
  `brew install go`
  `brew install htop`
  `brew install jq`
  `brew install macvim`
  `brew install markdown`
  `brew install maven`
  `brew install memcached`
  `brew install neovim`
  `brew install postgresql`
  `brew install readline`
  `brew install rbenv`
  `brew install ruby-build`
  `brew install sdl2`
  `brew install the_silver_searcher`
  `brew install tmux`
  `brew install tree`
  `brew install watch`
  `brew install wget`
  `brew install cmake`
  `brew install yarn`
  `brew install tldr`
end

task :node do
  `curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.8/install.sh | bash`
  `nvm install node`
  `nvm use node`
end

task :ruby do
  puts "\nInstalling rbenv plugins...\n"
  `mkdir -p ~/.rbenv/plugins`
  `rm -rf ~/.rbenv/plugins/rbenv-ctags`
  `git clone git://github.com/tpope/rbenv-ctags.git ~/.rbenv/plugins/rbenv-ctags`
  `rm -rf ~/.rbenv/plugins/rbenv-default-gems`
  `git clone git://github.com/sstephenson/rbenv-default-gems.git ~/.rbenv/plugins/rbenv-default-gems`

  puts "\nInstalling rubies...\n"
  `rbenv install -s 2.2.3`
  `rbenv global 2.2.3`
  `rbenv rehash`

  puts "\nRunning rbenv ctags...\n"
  `rbenv ctags`
end

task :vim do
  puts "\nEnsuring vim is installed...\n"
  `brew install macvim`

  puts "\nPreparing Vundle\n"
  `git clone https://github.com/VundleVim/Vundle.vim.git ~/.vim/bundle/Vundle.vim`

  puts "\nInstalling vim plugins...\n"
  `vim +PluginInstall +qall`
end

task :uninstall do
  puts "Uninstalling..."

  Dir.glob('**/*.symlink').each do |linkable|

    file = linkable.split('/').last.split('.symlink').last
    target = "#{ENV["HOME"]}/.#{file}"

    # Remove all symlinks created during installation
    if File.symlink?(target)
      FileUtils.rm(target)
    end

    # Replace any backups made during installation
    if File.exists?("#{ENV["HOME"]}/.#{file}.backup")
      `mv "$HOME/.#{file}.backup" "$HOME/.#{file}"`
    end

  end
end

task :vscode do
  puts "Installing vscode..."

  `wget -O vscode.zip https://go.microsoft.com/fwlink/?LinkID=620882`
  `unzip vscode.zip -d /Applications/`
  `defaults write com.microsoft.VSCode ApplePressAndHoldEnabled -bool false`
  `defaults write com.microsoft.VSCodeInsiders ApplePressAndHoldEnabled -bool false`

  puts "PLEASE NOTE: You must install the command line vscode executable manually."
end

task :help do
  puts "Run 'rake symlink' to install dot-files."
  puts "Run 'rake brew' to install necessary brew stuff."
  puts "Run 'rake node' to install node and npm stuff."
  puts "Run 'rake ruby' to install rbenv+plugins and ruby."
  puts "Run 'rake vim' to install vim+plugins."
  puts "Run 'rake vscode' to install vscode, its config, and its extensions."
  puts "Run 'rake install' to do all of the above."
end

task :install => [:symlink, :brew, :node, :vim, :ruby, :vscode]

task :default => 'help'
