import { dereference } from "./ASMMemory";
import { GBStruct } from "./gbdef";
import { gbcontainer } from ".";

const Module = window.Module;
export let gb_ptr;
export let gb;

export function startGameboy(rom) {
    Module['FS_createDataFile']('/', 'cartridge_rom', rom, true, true, true);
    gb_ptr = Module._launch_gameboy();
    gb = dereference(gb_ptr, GBStruct.Gameboy);
    gbcontainer.setGB(gb_ptr, gb);
    Module._start_gameboy_instance(gb_ptr);
}

export function allocateMemory(size) {
    return Module['_allocate_memory'](size);
}

export function freeMemory(ptr) {
    return Module['_free_memory'](ptr);
}

export function inspectMemory(gb_ptr, addr, buffer, size) {
    console.log(gb_ptr, addr, buffer, size);
    
    Module['_inspect_memory'](gb_ptr, addr, buffer, size);
}