#include <stdlib.h>
#include <stdio.h>
#include "cpu.h"

#define HIGH(reg) (reg >> 8)
#define LOW(reg) (reg & 0x00FF)
#define WORD(high, low) (((word)high) << 8 & low)

static int exec(CPU *cpu, opcode code);

static void set_flag(reg_8 *reg, uint8_t bit_idx, uint8_t val);
#define SET_ZERO(cpu, val) set_flag(&(cpu->F), 7, val)
#define SET_SUBTRACT(cpu, val) set_flag(&(cpu->F), 6, val)
#define SET_HALFCARRY(cpu, val) set_flag(&(cpu->F), 5, val)
#define SET_CARRY(cpu, val) set_flag(&(cpu->F), 4, val)
static uint8_t get_flag(reg_8 reg, uint8_t bit_idx);
#define GET_ZERO(cpu) get_flag(cpu->F, 7)
#define GET_SUBTRACT(cpu) get_flag(cpu->F, 6)
#define GET_HALFCARRY(cpu) get_flag(cpu->F, 5)
#define GET_CARRY(cpu) get_flag(cpu->F, 4)

static uint8_t OP_CYCLES[256] = {
    1, 3, 2, 2, 1, 1, 2, 1, 5, 2, 2, 2, 1, 1, 2, 1, // 0
    0, 3, 2, 2, 1, 1, 2, 1, 3, 2, 2, 2, 1, 1, 2, 1, // 1
    2, 3, 2, 2, 1, 1, 2, 1, 2, 2, 2, 2, 1, 1, 2, 1, // 2
    2, 3, 2, 2, 3, 3, 3, 1, 2, 2, 2, 2, 1, 1, 2, 1, // 3
    1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, // 4
    1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, // 5
    1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, // 6
    2, 2, 2, 2, 2, 2, 0, 2, 1, 1, 1, 1, 1, 1, 2, 1, // 7
    1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, // 8
    1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, // 9
    1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, // a
    1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, // b
    2, 3, 3, 4, 3, 4, 2, 4, 2, 4, 3, 0, 3, 6, 2, 4, // c
    2, 3, 3, 0, 3, 4, 2, 4, 2, 4, 3, 0, 3, 0, 2, 4, // d
    3, 3, 2, 0, 0, 4, 2, 4, 4, 1, 4, 0, 0, 0, 2, 4, // e
    3, 3, 2, 1, 0, 4, 2, 4, 3, 2, 4, 1, 0, 0, 2, 4, // f
};

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

static byte get_imm_byte(CPU *cpu)
{
    return mmu_get_byte(cpu->gb->mmu, cpu->PC++);
}

static word get_imm_word(CPU *cpu)
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

static void increment_reg16(reg_8 high, reg_8 low);

// returns the # of cpu cycles taken
static int exec(CPU *cpu, opcode code)
{
    // TODO: set flags
    MMU *mmu = cpu->gb->mmu;
    switch (code)
    {
    case 0x00: // NOP
        break;
    case 0x01: // LD BC,d16
    {
        word BC = get_imm_word(cpu);
        cpu->B = HIGH(BC);
        cpu->C = LOW(BC);
    }
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
    return OP_CYCLES[code] * 4;
}

static void set_flag(reg_8 *reg, uint8_t bit_idx, uint8_t val)
{
    (*reg) &= (0xFF - (1 << bit_idx));
    (*reg) |= val << bit_idx;
}

static uint8_t get_flag(reg_8 reg, uint8_t bit_idx)
{
    return (reg & (1 << bit_idx)) >> bit_idx;
}

static void increment_reg16(reg_8 high, reg_8 low)

{
    (*low)++;
    if (!*low)
        (*high)++;
}