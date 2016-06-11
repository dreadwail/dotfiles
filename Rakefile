require 'rake'

SYMLINK_MANIFEST = %w(
  Library/KeyBindings/DefaultKeyBinding.dict
  .ackrc
  .bash
  .bash_profile
  .bashrc
  .colordiffrc
  .git_template
  .gitconfig
  .gitignore
  .gvimrc
  .hushlogin 
  .inputrc
  .profile
  .vimrc
  .zshrc
  .atom/config.cson
  .atom/init.coffee
  .atom/keymap.cson
  .rbenv/default-gems
  .rbenv/plugins
  .vim/after
  .vim/bundle/Vundle.vim
  .vim/colors
)

desc "Hook our dotfiles into system-standard positions."
task :symlink do
  puts "\nSYMLINKING...\n"

  SYMLINK_MANIFEST.each do |linkable|
    target = "#{ENV["HOME"]}/#{linkable}"
    existed = false
    if File.exists?(target) || File.symlink?(target)
      existed = true
      FileUtils.rm_r(target)
    end
    source = "#{Dir.pwd}/symlinks/#{linkable}"
    printable_source = "symlinks/#{linkable}"
    extra = "(deleted previous existing)" if existed
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
  `brew install node`
  `brew install postgresql`
  `brew install rbenv`
  `brew install ruby-build`
  `brew install sdl2`
  `brew install the_silver_searcher`
  `brew install tmux`
  `brew install tree`
  `brew install watch`
  `brew install wget`
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

  puts "\nInstalling vim plugins...\n"
  `vim +PluginInstall +qall`
end

task :uninstall do

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

task :help do
  puts "Run 'rake symlink' to install dot-files."
  puts "Run 'rake brew' to install necessary brew stuff."
  puts "Run 'rake ruby' to install rbenv+plugins and ruby."
  puts "Run 'rake vim' to install vim+plugins."
  puts "Run 'rake install' to do all of the above."
end

task :install => [:symlink, :brew, :vim, :ruby]

task :default => 'help'
