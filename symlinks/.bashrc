source ~/projects/web/profile
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
  alias vi="mvim -v"
  alias vim="mvim -v"
fi
export EDITOR="vim"

# Ruby
eval "$(rbenv init -)"

# Python
export PATH=$HOME/Library/Python/2.7/bin:$PATH

# Heroku
export PATH="/usr/local/heroku/bin:$PATH"

# NVM
export NVM_DIR="$HOME/.nvm"
[ -s "/usr/local/opt/nvm/nvm.sh" ] && . "/usr/local/opt/nvm/nvm.sh"  # This loads nvm
[ -s "/usr/local/opt/nvm/etc/bash_completion" ] && . "/usr/local/opt/nvm/etc/bash_completion"  # This loads nvm bash_completion

# per-process macos resource limits
ulimit -n 524288 524288

if [[ "$OSTYPE" == "darwin"* ]]; then
  # dont use chrome gestures to navigate
  defaults write com.google.Chrome.plist AppleEnableSwipeNavigateWithScrolls -bool FALSE
  defaults write com.google.Chrome AppleEnableSwipeNavigateWithScrolls -bool FALSE
fi

# Android
PATH=$PATH:~/Library/Android/sdk/platform-tools
export ANDROID_HOME=~/Library/Android/sdk
export JAVA_HOME=/Applications/Android\ Studio.app/Contents/jre/jdk/Contents/Home
