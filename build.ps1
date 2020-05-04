$libs_src_path = "./src/libs/**"
$include_path = "./src/libs/include"
$gui_path = "./src/gui"
$output_path = "$gui_path/public"
$output_name = "gb_lib.js"
$srcfiles = Get-ChildItem $libs_src_path *.c

$prod_build = $args[0] -ne "dev"

if ($prod_build) {
    emsdk activate latest
}

emcc -O3 -s WASM=1 -s FORCE_FILESYSTEM=1 -s ASYNCIFY=1 -s $srcfiles -I $include_path -o $output_path/$output_name

if ($prod_build) {
    cd ./src/gui
    yarn build
    cd ../..
    Remove-Item -Path ./build -Recurse -Force
    Move-Item -Path $gui_path/build -Destination ./ -Force
}