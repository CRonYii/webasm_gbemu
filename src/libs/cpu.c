#include <stdlib.h>
#include <stdio.h>
#include "cpu.h"

int exec(CPU *cpu, opcode code);

CPU *create_cpu(Gameboy *gb)
{
    CPU *cpu = (CPU *)calloc(1, sizeof(CPU));
    if (!cpu)
    {
        printf("%s->%s line %d: Failed to allocate memory\n", __FILE__, __FUNCTION__, __LINE__);
        exit(1);
    }
    cpu->gb = gb;
    // initialize register values
    cpu->AF = 0x01B0;
    cpu->BC = 0x0013;
    cpu->DE = 0x00D8;
    cpu->HL = 0x014D;
    cpu->SP = 0xFFFE;
    cpu->PC = 0x0100;
    return cpu;
}

int next_op(CPU *cpu)
{
    // TODO: handle interrupt
    // fetch the opcode and increment PC
    opcode code = mmu_get_byte(cpu->gb->mmu, cpu->PC++);
    return exec(cpu, code);
}

word get_imm_word(CPU *cpu)
{
    return (word)mmu_get_byte(cpu->gb->mmu, cpu->PC++) + ((word)mmu_get_byte(cpu->gb->mmu, cpu->PC++) << 8);
}

// returns the # of cpu cycles taken
int exec(CPU *cpu, opcode code)
{
    switch (code)
    {
    case 0x00: // NOP
        return 4;
    case 0x01: // LD BC,d16
        cpu->BC = get_imm_word(cpu);
        return 12;
    default:
        printf("No such opcode 0x%X\n", code);
        exit(1);
    }
}