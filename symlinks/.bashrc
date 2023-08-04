export PATH=$PATH:$HOME
export PATH=$PATH:$HOME/bin
export PATH=$PATH:/opt/homebrew/bin/

# brew
eval "$(brew shellenv)"

# File containing secrets (not committed to source control).
# Not required to be present, but picked up if available.
SECRETS_CONFIG=~/.secrets
if [ -f $SECRETS_CONFIG ]; then
  source $SECRETS_CONFIG
fi

alias ls='ls --color=auto'

# If this is a mac, wire up some mac specific commands and defaults
if [[ "$OSTYPE" == "darwin"* ]]; then
  alias nosleep="caffeinate -dimsu"

  # per-process macos resource limits
  ulimit -n 524288 524288

  # dont use chrome gestures to navigate
  defaults write com.google.Chrome.plist AppleEnableSwipeNavigateWithScrolls -bool FALSE
  defaults write com.google.Chrome AppleEnableSwipeNavigateWithScrolls -bool FALSE

  # enable key-repeating in vscode vim
  defaults write com.microsoft.VSCode ApplePressAndHoldEnabled -bool false              # For VS Code

  # MacVim
  export PATH=$PATH:$HOME/.macvim
  alias vi="mvim -v"
  alias vim="mvim -v"
fi

# If this is a linux machine, wire up some linux specific commands and defaults
if [[ "$OSTYPE" == "linux-gnu" ]]; then
  eval "$(dircolors -b)"
  alias fgrep='fgrep --color=auto'
  alias egrep='egrep --color=auto'

  # check the window size after each command and, if necessary,
  # update the values of LINES and COLUMNS.
  shopt -s checkwinsize
fi


# Set some nice defaults/aliases for various CLI tools
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

# Git
source ~/.bash/git-completion.sh
export GITAWAREPROMPT=~/.bash/git-aware-prompt
source "${GITAWAREPROMPT}/main.sh"

if [[ "$OSTYPE" == "darwin"* ]]; then
  # Required on MacOS Monterey or newer
  ssh-add --apple-use-keychain -q ~/.ssh/id_rsa
fi

# Shell customization and colors
export PS1="\W \[$txtcyn\]\$git_branch\[$txtred\]\$git_dirty\[$txtrst\]\[$txtgrn\] \$\[$txtrst\] "
export CLICOLOR=1
export LSCOLORS=GxFxCxDxBxegedabagaced
export LS_COLORS=GxFxCxDxBxegedabagaced

# Ruby
export RUBY_CONFIGURE_OPTS="--with-openssl-dir=$(brew --prefix openssl@1.1)"
export PATH="$HOME/.rbenv/bin:$PATH"
eval "$(rbenv init -)"

# JavaScript
export NVM_DIR="$HOME/.nvm"
[ -s "/opt/homebrew/opt/nvm/nvm.sh" ] && \. "/opt/homebrew/opt/nvm/nvm.sh"  # This loads nvm
[ -s "/opt/homebrew/opt/nvm/etc/bash_completion.d/nvm" ] && \. "/opt/homebrew/opt/nvm/etc/bash_completion.d/nvm"  # This loads nvm bash_completion

cdnvm() {
    command cd "$@";
    nvm_path=$(nvm_find_up .nvmrc | tr -d '\n')

    # If there are no .nvmrc file, use the default nvm version
    if [[ ! $nvm_path = *[^[:space:]]* ]]; then

        declare default_version;
        default_version=$(nvm version default);

        # If there is no default version, set it to `node`
        # This will use the latest version on your machine
        if [[ $default_version == "N/A" ]]; then
            nvm alias default node;
            default_version=$(nvm version default);
        fi

        # If the current version is not the default version, set it to use the default version
        if [[ $(nvm current) != "$default_version" ]]; then
            nvm use default;
        fi

    elif [[ -s $nvm_path/.nvmrc && -r $nvm_path/.nvmrc ]]; then
        declare nvm_version
        nvm_version=$(<"$nvm_path"/.nvmrc)

        declare locally_resolved_nvm_version
        # `nvm ls` will check all locally-available versions
        # If there are multiple matching versions, take the latest one
        # Remove the `->` and `*` characters and spaces
        # `locally_resolved_nvm_version` will be `N/A` if no local versions are found
        locally_resolved_nvm_version=$(nvm ls --no-colors "$nvm_version" | tail -1 | tr -d '\->*' | tr -d '[:space:]')

        # If it is not already installed, install it
        # `nvm install` will implicitly use the newly-installed version
        if [[ "$locally_resolved_nvm_version" == "N/A" ]]; then
            nvm install "$nvm_version";
        elif [[ $(nvm current) != "$locally_resolved_nvm_version" ]]; then
            nvm use "$nvm_version";
        fi
    fi
}
alias cd='cdnvm'
cd "$PWD"

# React Testing Library stupidness
DEBUG_PRINT_LIMIT=99999999

# Python
export PYENV_ROOT="$HOME/.pyenv"
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

# the ever-evolving variations on clearing DNS from macos
dnsflush() {
  if [[ "$OSTYPE" == "darwin"* ]]; then
    sudo dscacheutil -flushcache
    sudo killall -HUP mDNSResponder
  else
    echo "Not implemented for non-macOS platforms!"
  fi
}

# Java
export PATH="$HOME/.jenv/bin:$PATH"
if [ -x "$(command -v jenv)" ]; then
  eval "$(jenv init -)"
  eval "jenv global 11.0"
fi
export PATH=$PATH:~/maven/bin

# Postgres
export PATH="/opt/homebrew/opt/postgresql@10/bin:$PATH"

# Work specific configuration. Not required to be present, but picked up if available.
WORK_CONFIG=~/.workrc
if [ -f $WORK_CONFIG ]; then
  source $WORK_CONFIG
fi


