" BEGIN Vundle
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
Bundle 'Lokaltog/powerline'
Bundle 'scrooloose/nerdtree'
Bundle 'ap/vim-css-color'
Bundle 'despo/vim-ruby-refactoring'
Bundle 'vim-scripts/slimv.vim'
Bundle 'kien/rainbow_parentheses.vim'
" END Vundle

set guifont=Menlo\ for\ Powerline
syntax on
filetype plugin indent on
set encoding=utf-8
set t_Co=256
colorscheme railscasts
set number
set expandtab
set tabstop=2
set shiftwidth=2
set noswapfile
set ruler
set ttimeoutlen=20

" BEGIN Powerline
set rtp+=~/.vim/bundle/powerline/powerline/bindings/vim
"Always show status bar
set laststatus=2 
"Defer to Powerline instead of standard status bar
set noshowmode 
" END Powerline

" BEGIN NERDTree
" use ctrl-n to open
map <C-n> :NERDTreeToggle<CR>
" close vim if nerdtree is the last thing
autocmd bufenter * if (winnr("$") == 1 && exists("b:NERDTreeType") && b:NERDTreeType == "primary") | q | endif
" END NERDTree

" BEGIN Rainbow parens
au VimEnter * RainbowParenthesesToggle
au Syntax * RainbowParenthesesLoadRound
au Syntax * RainbowParenthesesLoadSquare
au Syntax * RainbowParenthesesLoadBraces
" END Rainbow parens

" BEGIN Scheme
autocmd filetype lisp,scheme,art setlocal equalprg=~/scmindent.rkt
" END Scheme
