require 'rake'
require 'os'

SHARED_SYMLINK_MANIFEST = [
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
  ".rbenv/default-gems",
  ".rbenv/plugins",
  ".vim/after",
  ".vim/bundle/Vundle.vim",
  ".vim/colors",
  ".vscode"
]

MAC_SYMLINK_MANIFEST = [
  "Library/KeyBindings/DefaultKeyBinding.dict",
  "Library/Application Support/Code/User/settings.json",
  "Library/Application Support/Code/User/keybindings.json",
]

LINUX_SYMLINK_MANIFEST = [
  ".config/Code/User/settings.json",
  ".config/Code/User/keybindings.json"
]

desc "Hook our dotfiles into system-standard positions."
task :symlink do
  puts "\nSYMLINKING...\n"

  `touch ~/.secrets`
  `touch ~/.workrc`

  manifest = SHARED_SYMLINK_MANIFEST

  if OS.mac?
    puts "\nMAC DETECTED, INCLUDING OS-SPECIFIC SYMLINKS...\n"
    manifest += MAC_SYMLINK_MANIFEST
  end

  if OS.linux?
    puts "\nLINUX DETECTED, INCLUDING OS-SPECIFIC SYMLINKS...\n"
    manifest += LINUX_SYMLINK_MANIFEST
  end

  manifest.each do |linkable|
    target = "#{ENV["HOME"]}/#{linkable}"
    existed = false
    if File.exists?(target) || File.symlink?(target)
      existed = true

      `mv "#{target}" "#{target}.backup"`
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

task :software do
  puts "\nINSTALLING SOFTWARE...\n"

  if OS.mac?
    puts "\nMAC DETECTED. INSTALLING HOMEBREW.\n"
    system('/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"')

    puts "\nBREWING...\n"
    `brew cask install java`
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

  if OS.linux?
    puts "\nLINUX DETECTED. INSTALLING APT SOFTWARE...\n"

    system('sudo apt install git ack colordiff ctags rbenv htop jq markdown postgresql ruby-build tmux tree watch wget cmake yarn tldr gcc g++ make')
  end
end

task :node do
  puts "\nINSTALLING NVM...\n"
  `curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash`
  `export NVM_DIR="$HOME/.nvm"`

  puts "\nINSTALLING NODE WITH NVM...\n"

  `source ~/.bashrc && nvm install node`
  `source ~/.bashrc && nvm use node`
end

task :ruby do
  puts "\nInstalling rbenv plugins...\n"
  `mkdir -p ~/.rbenv/plugins`
  `rm -rf ~/.rbenv/plugins/rbenv-default-gems`
  `git clone git://github.com/sstephenson/rbenv-default-gems.git ~/.rbenv/plugins/rbenv-default-gems`

  puts "\nInstalling rubies...\n"
  `rbenv install -s 2.4.1`
  `rbenv global 2.4.1`
  `rbenv rehash`
end

task :vim do
  puts "\nEnsuring vim is installed...\n"

  if OS.mac?
    `brew install macvim`
  end

  if OS.linux?
    `sudo apt install vim`
  end

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

  if OS.linux?
    `wget -O vscode.deb https://go.microsoft.com/fwlink/?LinkID=760868`
    `sudo apt install ./vscode.deb`
    `xdg-mime default code.desktop text/plain`
  end

  if OS.mac?
    `wget -O vscode.zip https://go.microsoft.com/fwlink/?LinkID=620882`
    `unzip vscode.zip -d /Applications/`

    `defaults write com.microsoft.VSCode ApplePressAndHoldEnabled -bool false`
    `defaults write com.microsoft.VSCodeInsiders ApplePressAndHoldEnabled -bool false`

    puts "PLEASE NOTE: You must install the command line vscode executable manually."
  end
end

task :help do
  puts "Run 'rake symlink' to install dot-files."
  puts "Run 'rake software' to install necessary software."
  puts "Run 'rake node' to install node and npm."
  puts "Run 'rake ruby' to install rbenv+plugins and ruby."
  puts "Run 'rake vim' to install vim+plugins."
  puts "Run 'rake vscode' to install vscode, its config, and its extensions."
  puts "Run 'rake install' to do all of the above."
end

task :os do
  if OS.linux?
    puts "LINUX DETECTED. Changing shell to bash."
    system('sudo dpkg-reconfigure dash')
  end
end

task :install => [:os, :software, :symlink, :node, :vim, :ruby, :vscode]

task :default => 'help'
