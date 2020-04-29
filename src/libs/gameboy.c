#include <emscripten/emscripten.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "gameboy.h"

Gameboy *create_gameboy(byte* rom)
{
    Gameboy *gb = calloc(1, sizeof(Gameboy));
    if (!gb)
    {
        printf("%s->%s line %d: Failed to allocate memory\n", __FILE__, __FUNCTION__, __LINE__);
        exit(1);
    }
    gb->cart = load_cartridge(rom);
    gb->cpu = create_cpu(gb);
    gb->mmu = create_mmu(gb);
    char title[TITLE_END - TITLE_START + 2];
    title[TITLE_END - TITLE_START + 1] = '\0';
    memcpy(title, rom + TITLE_START, TITLE_END - TITLE_START + 1);
    printf("Cartridge loaded: %s\n", title);
    return gb;
}

void free_gameboy(Gameboy *gb)
{
    free(gb->cpu);
    free(gb->mmu);
    free_cartridge(gb->cart);
    free(gb);
}

void next_tick(Gameboy *gb) {
    int clock_cycles_taken = 0;
    while (clock_cycles_taken < CYCLES_PER_TICK) {
        clock_cycles_taken += next_op(gb->cpu);
    }
    emscripten_sleep(MS_PER_TICKS);
}

void start_gameboy(Gameboy *gb) {
    while (1) {
        next_tick(gb);
    }
}