# Shell colors
export CLICOLOR=1
export LSCOLORS=GxFxCxDxBxegedabagaced
alias diff="colordiff"

# MacVim
export PATH=$PATH:$HOME/.macvim
alias vim="mvim -v"
export EDITOR='mvim -f --nomru -c "au VimLeave * !open -a Terminal"'

# Node
export PATH=$PATH:/usr/local/share/npm/bin

# Go
export GOPATH=$HOME/Dropbox/Code/learning/go
export PATH=$PATH:$GOPATH/bin

# Java
export JAVA_HOME=/System/Library/Java/JavaVirtualMachines/1.6.0.jdk/Contents/Home

# Android
export PATH=/Users/byte/android-sdk-macosx:$PATH
export PATH=/Users/byte/android-sdk-macosx/platform-tools:$PATH
export PATH=/Users/byte/android-sdk-macosx/platforms:$PATH
export PATH=/Users/byte/android-sdk-macosx/tools:$PATH
export ANDROID_HOME=/Users/byte/android-sdk-macosx

# Ad-hoc shell scripts
export PATH=/Users/byte:$PATH
alias each="~/each"

# Local postgres
alias pgstart="pg_ctl -D /usr/local/var/postgres -l /usr/local/var/postgres/server.log start"
alias pgstop="pg_ctl -D /usr/local/var/postgres stop -s -m fast"

# Ruby
alias be="bundle exec"

# RVM
[[ -s "$HOME/.rvm/scripts/rvm" ]] && source "$HOME/.rvm/scripts/rvm" # Load RVM into a shell session *as a function*
PATH=$PATH:$HOME/.rvm/bin # Add RVM to PATH for scripting

# rbenv
#eval "$(rbenv init -)"
