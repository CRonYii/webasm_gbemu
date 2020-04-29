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

void EMSCRIPTEN_KEEPALIVE print_cpu_info(Gameboy *gb)
{
    CPU *cpu = gb->cpu;
    printf("AF = 0x%.4X BC = 0x%.4X DE = 0x%.4X HL = 0x%.4X\nSP = 0x%.4X PC = 0x%.4X\n",
           cpu->AF, cpu->BC, cpu->DE, cpu->HL,
           cpu->SP, cpu->PC);
}

byte EMSCRIPTEN_KEEPALIVE inspect_memory(Gameboy *gb, mem_addr addr)
{
    return mmu_get_byte(gb->mmu, addr);
}