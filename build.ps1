$libs_src_path = "./src/libs/**"
$web_src_path = "./src/web/**"
$output_path = "./output"
$output_name = "gb_lib.js"
$srcfiles = Get-ChildItem $libs_src_path *.c

emcc -O3 -s WASM=1 -s $srcfiles -o $output_path/$output_name
Copy-Item $web_src_path $output_path