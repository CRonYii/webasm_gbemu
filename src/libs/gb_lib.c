#include <emscripten/emscripten.h>
#include <stdio.h>
#include <stdlib.h>
#include "gameboy.h"
#include "mmu.h"
#include "cpu.h"

static Gameboy *GAMEBOY;

Gameboy *EMSCRIPTEN_KEEPALIVE launch_gameboy(byte *rom)
{
    free_gameboy(GAMEBOY);
    Gameboy *gb = create_gameboy(rom);
    GAMEBOY = gb;
    return gb;
}

void EMSCRIPTEN_KEEPALIVE start_gameboy_instance(Gameboy *gb)
{
    start_gameboy(gb);
}

void EMSCRIPTEN_KEEPALIVE step(Gameboy *gb)
{
    next_op(gb->cpu);
}

void EMSCRIPTEN_KEEPALIVE inspect_memory(Gameboy *gb, mem_addr addr, byte *buffer, mem_addr size)
{
    for (mem_addr i = 0; i < size; i++)
    {
        *buffer++ = mmu_get_byte(gb->mmu, addr + i);
    }
}

byte EMSCRIPTEN_KEEPALIVE get_memory_at(Gameboy *gb, mem_addr addr)
{
    return mmu_get_byte(gb->mmu, addr);
}

void *EMSCRIPTEN_KEEPALIVE allocate_memory(size_t size)
{
    return calloc(1, size);
}

void EMSCRIPTEN_KEEPALIVE free_memory(void *ptr)
{
    free(ptr);
}