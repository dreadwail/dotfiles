export PATH=$PATH:$HOME
export PATH=$PATH:$HOME/bin

# Work specific configuration. Not required to be present, but picked up if available.
WORK_CONFIG=~/.workrc
if [ -f $WORK_CONFIG ]; then
  source $WORK_CONFIG
fi

# File containing secrets (not committed to source control).
# Not required to be present, but picked up if available.
SECRETS_CONFIG=~/.secrets
if [ -f $SECRETS_CONFIG ]; then
  source $SECRETS_CONFIG
fi

# If this is a mac, wire up some mac specific commands and defaults
if [[ "$OSTYPE" == "darwin"* ]]; then
  alias nosleep="caffeinate -d -i -m -s"

  # per-process macos resource limits
  ulimit -n 524288 524288

  # dont use chrome gestures to navigate
  defaults write com.google.Chrome.plist AppleEnableSwipeNavigateWithScrolls -bool FALSE
  defaults write com.google.Chrome AppleEnableSwipeNavigateWithScrolls -bool FALSE

  # MacVim
  export PATH=$PATH:$HOME/.macvim
  alias vi="mvim -v"
  alias vim="mvim -v"
fi

# If this is a linux machine, wire up some linux specific commands and defaults
if [[ "$OSTYPE" == "linux-gnu" ]]; then
  export LS_OPTIONS='--color=auto'
  eval "$(dircolors -b)"
  alias ls='ls $LS_OPTIONS'
  alias grep='grep $LS_OPTIONS'
  alias fgrep='fgrep $LS_OPTIONS'
  alias egrep='egrep $LS_OPTIONS'

  # check the window size after each command and, if necessary,
  # update the values of LINES and COLUMNS.
  shopt -s checkwinsize
fi


# Set some nice defaults/aliases for various CLI tools
alias grep="grep --color=always"
alias ack="ag"
alias less="less -R"
alias diff="colordiff"
export EDITOR="vim"
# Suppress MacOS warnings about their desire to move you from bash to zsh
export BASH_SILENCE_DEPRECATION_WARNING=1
# Suppress GitHub filter branch warnings
export FILTER_BRANCH_SQUELCH_WARNING=1
# date with commands in history
export HISTTIMEFORMAT="%h %d %H:%M:%S "
# keep much more history than default
export HISTSIZE=9999999
# allow the history file to grow to accomodate more history
export HISTFILESIZE=9999999
# append to history instead of replacing it on new session
shopt -s histappend
# write the history immediately instead of at the end of the session
PROMPT_COMMAND="history -a;$PROMPT_COMMAND"
# Git-aware prompt and tab completion
source ~/.bash/git-completion.sh
export GITAWAREPROMPT=~/.bash/git-aware-prompt
source "${GITAWAREPROMPT}/main.sh"
# Create a visually nice git-aware shell prompt
export PS1="\W \[$txtcyn\]\$git_branch\[$txtred\]\$git_dirty\[$txtrst\]\[$txtgrn\] \$\[$txtrst\] "
# Shell colors
export CLICOLOR=1
export LSCOLORS=GxFxCxDxBxegedabagaced
export LS_COLORS=GxFxCxDxBxegedabagaced

# Ruby
export RUBY_CONFIGURE_OPTS="--with-openssl-dir=$(brew --prefix openssl@1.1)"
export PATH="$HOME/.rbenv/bin:$PATH"
eval "$(rbenv init -)"

# JavaScript
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"
# [ -s "/usr/local/opt/nvm/nvm.sh" ] && . "/usr/local/opt/nvm/nvm.sh"  # This loads nvm
# [ -s "/usr/local/opt/nvm/etc/bash_completion.d/nvm" ] && . "/usr/local/opt/nvm/etc/bash_completion.d/nvm"  # This loads nvm bash_completion

# Python
export PATH="$HOME/.pyenv/bin:$PATH"
if [ -x "$(command -v pyenv)" ]; then
  eval "$(pyenv init --path)"
  eval "$(pyenv init -)"
fi
export VIRTUAL_ENV_DISABLE_PROMPT=1

# Heroku
export PATH="/usr/local/heroku/bin:$PATH"

# TCP listeners
listening() {
  if [ $# -eq 0 ]; then
    sudo lsof -iTCP -sTCP:LISTEN -n -P
  elif [ $# -eq 1 ]; then
    sudo lsof -iTCP -sTCP:LISTEN -n -P | grep -i --color $1
  else
    echo "Usage: listening [pattern]"
  fi
}

# portslay:  kill the task active on the specified TCP port
portslay() {
   kill -9 `lsof -i tcp:$1 | tail -1 | awk '{ print $2;}'`
}