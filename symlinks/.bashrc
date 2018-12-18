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

# Shell colors
export CLICOLOR=1
export LSCOLORS=GxFxCxDxBxegedabagaced
export LS_COLORS=GxFxCxDxBxegedabagaced
alias diff="colordiff"

if [[ "$OSTYPE" == "linux-gnu" ]]; then
  export LS_OPTIONS='--color=auto'
  eval "$(dircolors -b)"
  alias ls='ls $LS_OPTIONS'
fi

# MacVim
if [[ "$OSTYPE" == "darwin"* ]]; then
  export PATH=$PATH:$HOME/.macvim
  #alias vi="mvim -v"
  #alias vim="mvim -v"
fi
export EDITOR="vim"

# Java
if [[ "$OSTYPE" == "darwin"* ]]; then
  export JAVA_HOME=`/usr/libexec/java_home -v 10`
fi

# Ruby
alias bers="bundle exec rails s"
eval "$(rbenv init -)"

# Heroku
export PATH="/usr/local/heroku/bin:$PATH"

# Yarn
if [[ "$OSTYPE" == "darwin"* ]]; then
  export PATH="$PATH:`yarn global bin`"
fi

# better than man
alias man="tldr"

# NVM
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

# per-process macos resource limits
ulimit -n 4096

if [[ "$OSTYPE" == "darwin"* ]]; then
  # dont use chrome gestures to navigate
  defaults write com.google.Chrome.plist AppleEnableSwipeNavigateWithScrolls -bool FALSE
  defaults write com.google.Chrome AppleEnableSwipeNavigateWithScrolls -bool FALSE
fi


