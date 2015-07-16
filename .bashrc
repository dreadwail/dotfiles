source ~/.secrets
source ~/.workrc

export PATH=$PATH:$HOME

alias ?="find . -name $@"

alias grep="grep --color=always"
alias less="less -R"

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

# Java
export JAVA_HOME=`/usr/libexec/java_home -v 1.8`

# Ruby
alias bers="bundle exec rails s"
eval "$(rbenv init -)"
