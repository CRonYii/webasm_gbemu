import { dereference } from "./ASMMemory";
import { GBStruct } from "./gbdef";

const Module = window.Module;
export let gb_ptr;
export let gb;

export function startGameboy(rom) {
    Module['FS_createDataFile']('/', 'cartridge_rom', rom, true, true, true);
    gb_ptr = Module._launch_gameboy();
    gb = dereference(gb_ptr, GBStruct.Gameboy);
    Module._start_gameboy_instance(gb_ptr);
}