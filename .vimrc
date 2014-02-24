" Begin Vundle
set nocompatible
filetype off
set rtp+=~/.vim/bundle/vundle/
call vundle#rc()
Bundle 'gmarik/vundle'
Bundle 'vim-ruby/vim-ruby'
Bundle 'vim-scripts/matchit.zip'
Bundle 'vim-scripts/ruby-matchit'
Bundle 'kana/vim-textobj-user'
Bundle 'nelstrom/vim-textobj-rubyblock'
Bundle 'kien/ctrlp.vim'
Bundle 'christoomey/vim-tmux-navigator'
" End Vundle

syntax on
filetype plugin indent on
set encoding=utf-8
colorscheme vibrantink
set number
set expandtab
set tabstop=2
set shiftwidth=2
set noswapfile
set ruler

