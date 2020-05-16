#include <stdlib.h>
#include <stdio.h>
#include "cpu.h"

#define HIGH(reg) (reg >> 8)
#define LOW(reg) (reg & 0x00FF)
#define WORD(high, low) (((word)high) << 8 & low)

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
    cpu->A = 0x01;
    cpu->F = 0xB0;
    cpu->B = 0x00;
    cpu->C = 0x13;
    cpu->D = 0x00;
    cpu->E = 0xD8;
    cpu->H = 0x01;
    cpu->L = 0x4D;
    cpu->SP = 0xFFFE;
    cpu->PC = 0x0100;
    return cpu;
}

byte get_imm_byte(CPU *cpu)
{
    return mmu_get_byte(cpu->gb->mmu, cpu->PC++);
}

word get_imm_word(CPU *cpu)
{
    return (word)get_imm_byte(cpu) + ((word)get_imm_byte(cpu) << 8);
}

int next_op(CPU *cpu)
{
    // TODO: handle interrupt
    // fetch the opcode and increment PC
    opcode code = get_imm_byte(cpu);
    return exec(cpu, code);
}

// returns the # of cpu cycles taken
int exec(CPU *cpu, opcode code)
{
    int cpu_cycles;
    // TODO: set flags
    MMU *mmu = cpu->gb->mmu;
    switch (code)
    {
    case 0x00: // NOP
        break;
    case 0x01: // LD BC,d16
        word BC = get_imm_word(cpu);
        cpu->B = HIGH(BC);
        cpu->C = LOW(BC);
        break;
    case 0x02: // LD (BC),A
        mmu_set_byte(mmu, WORD(cpu->B, cpu->C), cpu->A);
        break;
    case 0x03: // INC BC
        increment_reg16(&cpu->B, &cpu->C);
        break;
    case 0x04: // INC B
        cpu->B++;
        break;
    case 0x05: // DEC B
        cpu->B--;
        break;
    case 0x06: //LD B,d8
        cpu->B = get_imm_byte(cpu);
        break;
    default:
        printf("No such opcode 0x%X\n", code);
        exit(1);
    }
}

void increment_reg16(reg_8 *high, reg_8 *low)
{
    (*low)++;
    if (!*low)
        (*high)++;
}