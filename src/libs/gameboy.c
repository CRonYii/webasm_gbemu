#include <stdio.h>
#include <stdlib.h>
#include "gameboy.h"

Gameboy *create_gameboy()
{
    Gameboy *gb = calloc(1, sizeof(Gameboy));
    if (!gb)
    {
        printf("%s->%s line %d: Failed to allocate memory\n", __FILE__, __FUNCTION__, __LINE__);
        exit(1);
    }
    gb->cpu = create_cpu(gb);
    gb->mmu = create_mmu(gb);
    return gb;
}

void free_gameboy(Gameboy *gb)
{
    free(gb->cpu);
    free(gb->mmu);
    free(gb);
}

void print_cpu_info(Gameboy *gb)
{
    CPU *cpu = gb->cpu;
    printf("AF = 0x%.4X BC = 0x%.4X DE = 0x%.4X HL = 0x%.4X\nSP = 0x%.4X PC = 0x%.4X\n",
           cpu->AF, cpu->BC, cpu->DE, cpu->HL,
           cpu->SP, cpu->PC);
}