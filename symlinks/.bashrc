source ~/.secrets
source ~/.workrc
source ~/.bash/git-completion.sh

export PATH=$PATH:$HOME:$HOME/bin

alias grep="grep --color=always"
alias less="less -R"

# Git-aware prompt
export GITAWAREPROMPT=~/.bash/git-aware-prompt
source "${GITAWAREPROMPT}/main.sh"
export PS1="\W \[$txtcyn\]\$git_branch\[$txtred\]\$git_dirty\[$txtrst\]\[$txtgrn\] \$\[$txtrst\] "

git-lines() {
  git-graph --interval day --output chart "git ls-files -z $1 | xargs -0 cat | wc -l"
}

# Shell colors
export CLICOLOR=1
export LSCOLORS=GxFxCxDxBxegedabagaced
alias diff="colordiff"

# MacVim
export PATH=$PATH:$HOME/.macvim
#alias vi="mvim -v"
#alias vim="mvim -v"
export EDITOR="vim"

# Java
export JAVA_HOME=`/usr/libexec/java_home -v 1.8`

# Ruby
alias bers="bundle exec rails s"
eval "$(rbenv init -)"

# Heroku
export PATH="/usr/local/heroku/bin:$PATH"

# Yarn
export PATH="$PATH:`yarn global bin`"

# NVM
source $(brew --prefix nvm)/nvm.sh