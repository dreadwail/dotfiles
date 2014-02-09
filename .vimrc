execute pathogen#infect()
syntax on
filetype plugin indent on
autocmd vimenter * NERDTree
map <C-n> :NERDTreeToggle<CR>
autocmd bufenter * if (winnr("$") == 1 && exists("b:NERDTreeType") && b:NERDTreeType == "primary") | q | endif
colorscheme vibrantink
set number
set expandtab
set tabstop=2
set shiftwidth=2
let NERDTreeShowHidden=1
set noswapfile
