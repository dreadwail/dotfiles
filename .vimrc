execute pathogen#infect()
syntax on
filetype plugin indent on

" NERDTree
autocmd vimenter * NERDTree
map <C-n> :NERDTreeToggle<CR>
autocmd bufenter * if (winnr("$") == 1 && exists("b:NERDTreeType") && b:NERDTreeType == "primary") | q | endif
let NERDTreeShowHidden=1
let g:NERDTreeWinSize = 50

colorscheme vibrantink
set number
set expandtab
set tabstop=2
set shiftwidth=2
set noswapfile
set ruler
