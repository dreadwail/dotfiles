execute pathogen#infect()
syntax on
filetype plugin indent on
set encoding=utf-8

" NERDTree
autocmd vimenter * NERDTree
map <C-n> :NERDTreeToggle<CR>
autocmd bufenter * if (winnr("$") == 1 && exists("b:NERDTreeType") && b:NERDTreeType == "primary") | q | endif
let NERDTreeShowHidden=1
let g:NERDTreeWinSize = 45

" Ctrl-P
set runtimepath^=~/.vim/bundle/ctrlp.vim

colorscheme vibrantink
set number
set expandtab
set tabstop=2
set shiftwidth=2
set noswapfile
set ruler
