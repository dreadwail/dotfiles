require 'rake'
require 'os'

SHARED_SYMLINK_MANIFEST = [
  ".ackrc",
  ".bash",
  ".bash_profile",
  ".bashrc",
  ".colordiffrc",
  ".gitconfig",
  ".gitignore",
  ".gvimrc",
  ".hushlogin",
  ".inputrc",
  ".profile",
  ".vimrc",
  ".zshrc",
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
  puts "\n\nSYMLINKING...\n\n"

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

  puts "\n\nDONE SYMLINKING...\n\n"
end

task :software do
  puts "\n\nINSTALLING SOFTWARE...\n\n"

  if OS.mac?
    puts "\nMAC DETECTED. INSTALLING HOMEBREW.\n"
    # TODO: detect if brew is already installed here instead of reinstalling each time
    system('/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"')

    puts "\nBREWING...\n"
    `brew install icu4c`
    `brew install node`
    `brew install ack`
    `brew install colordiff`
    `brew install htop`
    `brew install httpie`
    `brew install jq`
    `brew install macvim`
    `brew install neovim`
    `brew install nvm`
    `brew install readline`
    `brew install rbenv`
    `brew install ruby-build`
    `brew install the_silver_searcher`
    `brew install tmux`
    `brew install tree`
    `brew install watch`
    `brew install wget`
    `brew install yarn`
  end

  if OS.linux?
    puts "\nLINUX DETECTED. INSTALLING APT SOFTWARE...\n"

    system('sudo apt install ack bzip2 colordiff g++ git gcc htop httpie jq libreadline6 libreadline6-dev make openssl rbenv ruby-build tmux tree watch wget yarn')
    system('/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"')
  end

  puts "\n\nDONE INSTALLING SOFTWARE...\n\n"
end

task :node => :software do
  puts "\n\nINSTALLING NODE WITH NVM...\n\n"

  `brew install nvm`
  `mkdir -p ~/.nvm`

  `bash -c "source ~/.bashrc && nvm install node"`
  `bash -c "source ~/.bashrc && nvm use node"`

  puts "\n\nDONE INSTALLING NODE WITH NVM...\n\n"
end

task :ruby => :software do
  puts "\n\nINSTALLING RUBY\n\n"

  `rbenv install -s 2.4.0`
  `rbenv global 2.4.0`
  `rbenv rehash`

  puts "\n\nDONE INSTALLING RUBY\n\n"
end

task :python => :software do
  puts "\n\nINSTALLING PYTHON...\n\n"

  `rm -rf ~/.pyenv`
  `curl https://pyenv.run | bash`
  `pyenv install 3.6.8`
  `pyenv global 3.6.8`

  puts "\n\nDONE INSTALLING PYTHON...\n\n"
end

task :vim => :software do
  puts "\n\nINSTALLING VIM...\n\n"

  if OS.mac?
    `brew install macvim`
  end

  if OS.linux?
    `sudo apt install vim`
  end

  puts "\nPreparing Vundle\n"
  `rm -rf ~/.vim/bundle/Vundle.vim`
  `git clone https://github.com/VundleVim/Vundle.vim.git ~/.vim/bundle/Vundle.vim`

  puts "\nInstalling vim plugins...\n"
  `vim +PluginInstall +qall`

  puts "\n\nDONE INSTALLING VIM...\n\n"
end

task :uninstall do
  puts "\n\nUNINSTALLING...\n\n"

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

  puts "\n\nDONE UNINSTALLING...\n\n"
end

task :vscode do
  puts "\n\nCONFIGURING VSCODE...\n\n"

  # TODO: make this output bigger/scarier
  puts "PLEASE NOTE: You must separately install vscode manually for your respective OS."

  puts "Configuring OS-level things for vscode..."
  if OS.linux?
    `xdg-mime default code.desktop text/plain`
  end

  if OS.mac?
    `defaults write com.microsoft.VSCode ApplePressAndHoldEnabled -bool false`
    `defaults write com.microsoft.VSCodeInsiders ApplePressAndHoldEnabled -bool false`
  end

  puts "\n\nDONE CONFIGURING VSCODE...\n\n"
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
