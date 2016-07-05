" BEGIN Vundle
set nocompatible
filetype off
set rtp+=~/.vim/bundle/Vundle.vim
call vundle#begin()
Plugin 'VundleVim/Vundle.vim'               " plugin installer
Plugin 'vim-ruby/vim-ruby'                  " syntax highlighting for ruby
Plugin 'kana/vim-textobj-user'              " dependency of vim-textobj-rubyblock
Plugin 'nelstrom/vim-textobj-rubyblock'     " select ruby code class/module/method/blocks
Plugin 'ctrlpvim/ctrlp.vim'                 " fuzzy finder
Plugin 'powerline/powerline'                " status bar at the bottom of the screen
Plugin 'scrooloose/nerdtree'                " file explorer
Plugin 'ap/vim-css-color'                   " preview css colors when typing them
Plugin 'tmhedberg/matchit'                  " dependency of vim-ruby-refactoring
Plugin 'despo/vim-ruby-refactoring'         " https://justinram.wordpress.com/2010/12/30/vim-ruby-refactoring-series/
Plugin 'kien/rainbow_parentheses.vim'       " color-matched parens/braces for easy visual inspection
Plugin 't9md/vim-ruby-xmpfilter'            " visual execution of selected code
Plugin 'JamshedVesuna/vim-markdown-preview' " preview markdown files in your web browser
Plugin 'pangloss/vim-javascript'            " required by vim-jsx
Plugin 'mxw/vim-jsx'                        " react jsx syntax highlighting/indenting
Plugin 'elixir-lang/vim-elixir'             " elixir support
Plugin 'ngmy/vim-rubocop'                   " run rubocop inline in vim
Plugin 'scrooloose/syntastic'               " automatic errors/warnings in realtime
Plugin 'Valloric/YouCompleteMe'             " auto-completion
call vundle#end()
" END Vundle

" BEGIN vanilla vim defaults
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
set clipboard=unnamed " share clipboard between vim/osx
autocmd FileType * setlocal formatoptions-=c formatoptions-=r formatoptions-=o " dont auto-insert comments on newline
" switch to last buffer via tilde
nnoremap ` :b#<CR>
let mapleader = "\<tab>"
" END vanilla vim defaults

" BEGIN javascript/es6/jsx
let g:jsx_ext_required = 0  " treat any javascript file as JSX capable
" END javascript/es6/jsx

" BEGIN spell check in markdown
autocmd BufRead,BufNewFile *.md setlocal spell spelllang=en_us
autocmd BufRead,BufNewFile *.markdown setlocal spell spelllang=en_us
" END spell check in markdown

" BEGIN Powerline
set rtp+=~/.vim/bundle/powerline/powerline/bindings/vim
set laststatus=2 " Always show status bar
set noshowmode "Defer to Powerline instead of standard status bar
" END Powerline

" BEGIN NERDTree
" use ctrl-n to open
map <C-n> :NERDTreeToggle<CR>
let g:NERDTreeShowHidden=1
let g:NERDTreeWinSize=38
let g:NERDTreeMinimalUI=1   " dont show the help text at the top
let g:NERDTreeCascadeOpenSingleChildDir=1   " open single directory paths recursively
" END NERDTree

" BEGIN Rainbow parens
au VimEnter * RainbowParenthesesToggle
au Syntax * RainbowParenthesesLoadRound
au Syntax * RainbowParenthesesLoadSquare
au Syntax * RainbowParenthesesLoadBraces
let g:rbpt_colorpairs = [
    \ ['brown',       'RoyalBlue3'],
    \ ['Darkblue',    'SeaGreen3'],
    \ ['darkgray',    'DarkOrchid3'],
    \ ['darkgreen',   'firebrick3'],
    \ ['darkcyan',    'RoyalBlue3'],
    \ ['darkred',     'SeaGreen3'],
    \ ['darkmagenta', 'DarkOrchid3'],
    \ ['brown',       'firebrick3'],
    \ ['gray',        'RoyalBlue3'],
    \ ['darkmagenta', 'DarkOrchid3'],
    \ ['Darkblue',    'firebrick3'],
    \ ['darkgreen',   'RoyalBlue3'],
    \ ['darkcyan',    'SeaGreen3'],
    \ ['darkred',     'DarkOrchid3'],
    \ ['red',         'firebrick3'],
    \ ]
" END Rainbow parens

" BEGIN Ctrl-P
let g:ctrlp_show_hidden = 1
let g:ctrlp_match_window = 'bottom,order:btt,min:1,max:30,results:30'
set wildignore+=*/tmp/*,*.so,*.swp,*.zip
let g:ctrlp_custom_ignore = {
    \ 'dir':  '\.git$\|\.hg$\|\.svn$\|bower_components$\|node_modules$',
    \ 'file': '\.exe$\|\.so$\|\.dll$\|\.pyc$' }
" END Ctrl-P

" BEGIN vim-ruby
let g:rubycomplete_classes_in_global = 1
let g:rubycomplete_rails = 1
let g:rubycomplete_load_gemfile = 1
inoremap <Nul> <C-x><C-o>
" END vim-ruby

" BEGIN seeing-is-believing
let g:xmpfilter_cmd = "seeing_is_believing"
autocmd FileType ruby nmap <buffer> <C-r> <Plug>(seeing_is_believing-clean) <Plug>(seeing_is_believing-mark) <Plug>(seeing_is_believing-run)
autocmd FileType ruby xmap <buffer> <C-r> <Plug>(seeing_is_believing-clean) <Plug>(seeing_is_believing-mark) <Plug>(seeing_is_believing-run)
autocmd FileType ruby imap <buffer> <C-r> <Plug>(seeing_is_believing-clean) <Plug>(seeing_is_believing-mark) <Plug>(seeing_is_believing-run)
" END seeing-is-believing

" BEGIN rubocop
let g:vimrubocop_config = '~/.rubocop.yml'
" END rubocop

" BEGIN syntastic
set statusline+=%#warningmsg#
set statusline+=%{SyntasticStatuslineFlag()}
set statusline+=%*
let g:syntastic_always_populate_loc_list = 1
let g:syntastic_auto_loc_list = 1
let g:syntastic_check_on_open = 0 " https://github.com/scrooloose/syntastic/issues/400
let g:syntastic_check_on_wq = 0
let g:syntastic_ruby_checkers = ['mri', 'rubocop']
let g:syntastic_enable_highlighting = 1
let g:syntastic_enable_signs=1
let g:syntastic_ruby_rubocop_exec='~/rubocop.sh'
" END syntastic

" BEGIN youcompleteme
let g:ycm_key_list_select_completion = ['<ENTER>', '<TAB>', '<Down>']
" END youcompleteme
