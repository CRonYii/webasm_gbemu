const Module = window.Module;
export let gb;

export function startGameboy(rom) {
    Module['FS_createDataFile']('/', 'cartridge_rom', rom, true, true, true);
    gb = Module._launch_gameboy();
    Module._start_gameboy_instance(gb);
}