$libs_src_path = "./src/libs/**"
$include_path = "./src/libs/include"
$web_src_path = "./src/web/**"
$output_path = "./output"
$output_name = "gb_lib.js"
$srcfiles = Get-ChildItem $libs_src_path *.c

If (!(Test-Path $output_path)) {
    New-Item -ItemType Directory -Force -Path $output_path
}

emsdk activate latest
emcc -O3 -s WASM=1 -s FORCE_FILESYSTEM=1 -s ASYNCIFY=1 -s $srcfiles -I $include_path -o $output_path/$output_name
Copy-Item $web_src_path $output_path