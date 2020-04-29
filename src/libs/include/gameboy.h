#pragma once

#include "cpu.h"
#include "mmu.h"
#include "apu.h"
#include "ppu.h"
#include "joypad.h"
#include "gbtimer.h"
#include "cartridge.h"

#define CPU_CLOCK_SPEED 4194304
#define TICKS_PER_SECONDS 62.5
#define CYCLES_PER_TICK (CPU_CLOCK_SPEED / TICKS_PER_SECONDS)
#define MS_PER_TICKS (1000 / TICKS_PER_SECONDS)

typedef struct Gameboy Gameboy;

struct Gameboy
{
    struct CPU *cpu;
    struct MMU *mmu;
    struct APU *apu;
    struct PPU *ppu;
    struct Joypad *joypad;
    struct GBTimer *gbtimer;
    struct Cartridge *cart;

    flag interrupt_enable;
    flag interrupt_flags;
};

Gameboy *create_gameboy(byte *rom);

void free_gameboy(Gameboy *gb);

void start_gameboy(Gameboy *gb);