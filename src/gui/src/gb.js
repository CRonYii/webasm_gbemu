import { dereference } from "./ASMMemory";
import { GBStruct } from "./gbdef";
import { gbcontainer } from ".";

const Module = window.Module;

export function launchGameboy(rom) {
    Module['FS_createDataFile']('/', 'cartridge_rom', rom, true, true, true);
    const gb_ptr = Module._launch_gameboy();
    const gb = dereference(gb_ptr, GBStruct.Gameboy);
    gbcontainer.setGB(gb_ptr, gb);
}

export function startGameboy(gb_ptr) {
    Module._start_gameboy_instance(gb_ptr);
}

export function stepGameboy(gb_ptr) {
    Module._step(gb_ptr);
}

export function getMemoryAt(gb_ptr, addr) {
    return Module['_get_memory_at'](gb_ptr, addr);
}

export function allocateMemory(size) {
    return Module['_allocate_memory'](size);
}

export function freeMemory(ptr) {
    return Module['_free_memory'](ptr);
}

export function inspectMemory(gb_ptr, addr, buffer, size) {
    Module['_inspect_memory'](gb_ptr, addr, buffer, size);
}