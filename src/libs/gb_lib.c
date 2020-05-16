#include <emscripten/emscripten.h>
#include <stdio.h>
#include <stdlib.h>
#include "gameboy.h"
#include "mmu.h"
#include "cpu.h"

static Gameboy *GAMEBOY;

Gameboy *EMSCRIPTEN_KEEPALIVE launch_gameboy()
{
    free_gameboy(GAMEBOY);
    FILE *fp = fopen("cartridge_rom", "r");
    if (!fp)
    {
        printf("%s->%s line %d: Failed to open file\n", __FILE__, __FUNCTION__, __LINE__);
        exit(1);
    }
    fseek(fp, 0L, SEEK_END);
    size_t size = ftell(fp);
    fseek(fp, 0L, SEEK_SET);
    byte *rom = malloc(size);
    fread(rom, size, 1, fp);
    fclose(fp);
    remove("cartridge_rom");
    Gameboy *gb = create_gameboy(rom);
    GAMEBOY = gb;
    free(rom);
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

void EMSCRIPTEN_KEEPALIVE inspect_memory(Gameboy *gb, mem_addr addr, byte* buffer, mem_addr size)
{
    for (mem_addr i = 0; i < size; i++) {
        *buffer++ = mmu_get_byte(gb->mmu, addr + i);
    }
}

byte EMSCRIPTEN_KEEPALIVE get_memory_at(Gameboy *gb, mem_addr addr)
{
    return mmu_get_byte(gb->mmu, addr);
}

void* EMSCRIPTEN_KEEPALIVE allocate_memory(size_t size)
{
    return calloc(1, size);
}

void EMSCRIPTEN_KEEPALIVE free_memory(void* ptr)
{
    free(ptr);
}