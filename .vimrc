" BEGIN Vundle
set nocompatible
filetype off
set rtp+=~/.vim/bundle/Vundle.vim
call vundle#begin()
Plugin 'gmarik/vundle'
Plugin 'vim-ruby/vim-ruby'
Plugin 'vim-scripts/matchit.zip'
Plugin 'vim-scripts/ruby-matchit'
Plugin 'kana/vim-textobj-user'
Plugin 'nelstrom/vim-textobj-rubyblock'
Plugin 'kien/ctrlp.vim'
Plugin 'christoomey/vim-tmux-navigator'
Plugin 'Lokaltog/powerline'
Plugin 'scrooloose/nerdtree'
Plugin 'ap/vim-css-color'
Plugin 'despo/vim-ruby-refactoring'
Plugin 'kovisoft/slimv'
Plugin 'kien/rainbow_parentheses.vim'
call vundle#end()
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
autocmd VimResized * wincmd =

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
let NERDTreeShowHidden=1
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
