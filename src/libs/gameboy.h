#pragma once

#include <emscripten/emscripten.h>
#include "cpu.h"
#include "mmu.h"
#include "apu.h"
#include "ppu.h"
#include "joypad.h"
#include "gbtimer.h"
#include "cartridge.h"


typedef struct Gameboy Gameboy;

struct Gameboy
{
    struct CPU *cpu;
    struct MMU *mmu;
    struct APU * apu;
    struct PPU *ppu;
    struct Joypad *joypad;
    struct GBTimer *gbtimer;
    struct Cartridge *cart;

    flag interrupt_enable;
    flag interrupt_flags;
};

Gameboy *EMSCRIPTEN_KEEPALIVE create_gameboy();

void EMSCRIPTEN_KEEPALIVE free_gameboy(Gameboy *gb);

void EMSCRIPTEN_KEEPALIVE print_cpu_info(Gameboy *gb);