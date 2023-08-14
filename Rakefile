require 'rake'
require 'os'

SHARED_SYMLINK_MANIFEST = [
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

desc "Hook our dotfiles into system-standard positions."
task :symlink do
  puts "\n\nSYMLINKING...\n\n"

  manifest = SHARED_SYMLINK_MANIFEST

  if OS.mac?
    puts "\nMAC DETECTED, INCLUDING OS-SPECIFIC SYMLINKS...\n"
    manifest += MAC_SYMLINK_MANIFEST
  end

  if OS.linux?
    puts "\nLINUX DETECTED. NO OS-SPECIFIC SYMLINKS WILL BE PLACED. YOU MUST DO THIS MANUALLY.\n"
    puts "\nNOTABLY: PLEASE COPY THE VSCODE SETTINGS MANUALLY FROM THEIR MACOS LOCATIONS.\n"
  end

  manifest.each do |linkable|
    target = "#{ENV["HOME"]}/#{linkable}"
    existed = false
    if File.exist?(target) || File.symlink?(target)
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

  puts "IMPORTANT: Please configure your git email as appropriate (work, etc)"

  puts "\n\nDONE SYMLINKING...\n\n"
end

task :software do
  puts "\n\nINSTALLING SOFTWARE...\n\n"

  if OS.mac?
    puts "\nMAC DETECTED. INSTALLING HOMEBREW.\n"

    if !system('which brew')
      system('/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"')
    end

    puts "\nINSTALLING SOFTWARE VIA BREW...\n"
    `brew install icu4c`
    `brew install colordiff`
    `brew install git`
    `brew install htop`
    `brew install jq`
    `brew install neovim`
    `brew install readline`
    `brew install the_silver_searcher`
    `brew install tmux`
    `brew install tree`
    `brew install watch`
    `brew install watchman`
    `brew install wget`
  end

  if OS.linux?
    puts "\nLINUX DETECTED. INSTALLING APT SOFTWARE...\n"

    system('sudo apt install ack bzip2 colordiff g++ git gcc htop httpie jq libreadline6 libreadline6-dev make openssl tmux tree watch wget')
    system('/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"')
  end

  puts "\n\nDONE INSTALLING SOFTWARE...\n\n"
end

task :node => :software do
  puts "\n\nINSTALLING NODE WITH NVM...\n\n"

  system('curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.4/install.sh | bash');

  `mkdir -p ~/.nvm`

  `bash -c "source ~/.bashrc && nvm install node"`
  `bash -c "source ~/.bashrc && nvm use node"`

  `nvm install 18.13.0`
  `nvm use 18.13.0`
  `nvm alias default 18.13.0`

  `npm install -g yarn`

  puts "\n\nDONE INSTALLING NODE WITH NVM...\n\n"
end

task :ruby => :software do
  puts "\n\nINSTALLING RUBY\n\n"

  if OS.mac?
    `brew install rbenv`
    `brew install ruby-build`
  end

  if OS.linux?
    system('sudo apt install rbenv ruby-build')
  end

  `rbenv install -s 2.4.0`
  `rbenv global 2.4.0`
  `rbenv rehash`

  puts "\n\nDONE INSTALLING RUBY\n\n"
end

task :python => :software do
  puts "\n\nINSTALLING PYTHON...\n\n"

  `rm -rf ~/.pyenv`
  `curl https://pyenv.run | bash`
  `pyenv install 3.11.1`
  `pyenv global 3.11.1`

  puts "\n\nDONE INSTALLING PYTHON...\n\n"
end

task :vim => :software do
  puts "\n\nINSTALLING VIM...\n\n"

  if OS.mac?
    `brew install macvim`
    `brew install neovim`
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
    if File.exist?("#{ENV["HOME"]}/.#{file}.backup")
      `mv "$HOME/.#{file}.backup" "$HOME/.#{file}"`
    end
  end

  puts "\n\nDONE UNINSTALLING...\n\n"
end

task :vscode do
  puts "\n\nCONFIGURING VSCODE...\n\n"
  puts "\n\n ***** PLEASE NOTE: You must separately install vscode manually for your respective OS.\n\n"

  puts "Configuring OS-level things for vscode..."

  if OS.linux?
    `xdg-mime default code.desktop text/plain`
  end

  if OS.mac?
    `defaults write com.microsoft.VSCode ApplePressAndHoldEnabled -bool false`
    `defaults write com.microsoft.VSCodeInsiders ApplePressAndHoldEnabled -bool false`
  end

  puts "\n\nEXTENSIONS: You will want to install these extensions in vscode:\n\n"

  extensions = <<-VSCEXTS
alexdima.copy-relative-path
casualjim.gotemplate
christian-kohler.path-intellisense
dbaeumer.vscode-eslint
dotjoshjohnson.xml
eamodio.gitlens
esbenp.prettier-vscode
gruntfuggly.save-without-format
hashicorp.terraform
janisdd.vscode-edit-csv
vscode-styled-components
kumar-harsh.graphql-for-vscode
mechatroner.rainbow-csv
mrded.railscasts
ms-azuretools.vscode-docker
ms-python.python
ms-toolsai.jupyter
ms-vscode-remote.remote-containers
redhat.java
ricard.postcss
shanoor.vscode-nginx
sleistner.vscode-fileutils
syler.sass-indented
vscode-icons-team.vscode-icons
vscodevim.vim
VSCEXTS

  puts extensions

  puts "\n\nDONE CONFIGURING VSCODE...\n\n"
end

task :help do
  puts "Run 'rake symlink' to install dot-files."
  puts "Run 'rake software' to install necessary software."
  puts "Run 'rake node' to install node and npm."
  puts "Run 'rake ruby' to install rbenv+plugins and ruby."
  puts "Run 'rake vim' to install vim+plugins."
  puts "Run 'rake vscode' to configure some helpful vscode settings."
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
