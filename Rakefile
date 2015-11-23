require 'rake'

desc "Hook our dotfiles into system-standard positions."
task :symlink do
  # please if you see this and are offended by it please drop some knowledge on me in a pull request
  linkables = (Dir.glob('**/*.symlink') + Dir.glob('**/.*.symlink') + Dir.glob('.*/**/*.symlink')).reject { |d| d.start_with?("..") }

  skip_all = false
  overwrite_all = false
  backup_all = false

  linkables.each do |linkable|
    overwrite = false
    backup = false

    file = linkable.split('.symlink').last
    target = "#{ENV["HOME"]}/#{file}"

    if File.exists?(target) || File.symlink?(target)
      unless skip_all || overwrite_all || backup_all
        puts "File already exists: #{target}, what do you want to do? [s]kip, [S]kip all, [o]verwrite, [O]verwrite all, [b]ackup, [B]ackup all"
        case STDIN.gets.chomp
        when 'o' then overwrite = true
        when 'b' then backup = true
        when 'O' then overwrite_all = true
        when 'B' then backup_all = true
        when 'S' then skip_all = true
        when 's' then next
        end
      end
      FileUtils.rm_rf(target) if overwrite || overwrite_all
      `mv "$HOME/.#{file}" "$HOME/.#{file}.backup"` if backup || backup_all
    end
    `mkdir -p "$(dirname "#{target}")"`
    `ln -s "$PWD/#{linkable}" "#{target}"`
  end
end

task :brew do
  puts "BREWING..."
  `brew install ack`
  `brew install colordiff`
  `brew install ctags`
  `brew install rbenv`
  `brew install go`
  `brew install jq`
  `brew install macvim`
  `brew install maven`
  `brew install memcached`
  `brew install ngrok`
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
  puts "Installing rbenv plugins..."
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
  puts "Ensuring vim is installed..."
  `brew install macvim`

  puts "Installing vim plugins..."
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
