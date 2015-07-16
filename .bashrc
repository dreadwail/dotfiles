source ~/.secrets
source ~/.workrc

export PATH=$PATH:$HOME:$HOME/bin

alias ?="find . -name $@"
alias grep="grep --color=always"
alias less="less -R"

# Shell colors
export CLICOLOR=1
export LSCOLORS=GxFxCxDxBxegedabagaced
alias diff="colordiff"

# Git
alias gs="git status"

# MacVim
export PATH=$PATH:$HOME/.macvim
alias vim="mvim -v"
export EDITOR='mvim -f --nomru -c "au VimLeave * !open -a Terminal"'

# Java
export JAVA_HOME=`/usr/libexec/java_home -v 1.8`

# Ruby
alias bers="bundle exec rails s"
eval "$(rbenv init -)"

# Heroku
export PATH="/usr/local/heroku/bin:$PATH"
